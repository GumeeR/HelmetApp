from pn532 import PN532
import time
from machine import I2C, Pin

class PN532_I2C(PN532):
    """PN532 implementation for I2C."""
    
    def __init__(self, i2c, *, irq=None, reset=None, address=0x24, debug=False):
        """Initialize PN532 with I2C communication.
        
        Args:
            i2c (machine.I2C): The I2C interface to use
            irq (machine.Pin): Optional IRQ pin (not used)
            reset (machine.Pin): Optional reset pin
            address (int): I2C address (default: 0x24)
            debug (bool): Debug mode
        """
        self.address = address
        self.i2c = i2c
        self._i2c_lock = False
        super().__init__(debug=debug, irq=irq, reset=reset)
    
    def _read_data(self, count):
        """Read data from the PN532 via I2C."""
        # For I2C, we need to send a read command first
        if self.debug:
            print("Reading", count, "bytes from I2C")
        
        # Lock the I2C bus during the transaction
        if self._i2c_lock:
            if self.debug:
                print("I2C bus locked, waiting...")
            for _ in range(20):  # Try for about 2 seconds
                time.sleep(0.1)
                if not self._i2c_lock:
                    break
            else:
                raise RuntimeError("I2C bus seems locked!")
        
        self._i2c_lock = True
        try:
            # For I2C, first we need to send a "read status" command
            self.i2c.writeto(self.address, b'\x01', stop=False)
            # Now read the response data
            result = bytearray(count)
            result = self.i2c.readfrom(self.address, count)
            if self.debug:
                print("Read:", [hex(i) for i in result])
            return result
        finally:
            self._i2c_lock = False
    
    def _write_data(self, framebytes):
        """Write data to the PN532 via I2C."""
        if self.debug:
            print("Writing:", [hex(i) for i in framebytes])
        
        # Wait if the bus is locked
        if self._i2c_lock:
            for _ in range(20):  # Try for about 2 seconds
                time.sleep(0.1)
                if not self._i2c_lock:
                    break
            else:
                raise RuntimeError("I2C bus seems locked!")
        
        self._i2c_lock = True
        try:
            # For I2C we need to add a byte at the beginning
            data = bytearray(len(framebytes) + 1)
            data[0] = 0x01  # I2C write command
            data[1:] = framebytes
            
            # Send data in chunks of 32 bytes max (I2C limitation on some platforms)
            for i in range(0, len(data), 32):
                chunk = data[i:min(i+32, len(data))]
                self.i2c.writeto(self.address, chunk)
                time.sleep(0.002)  # Brief pause between chunks
        finally:
            self._i2c_lock = False
    
    def _wait_ready(self, timeout=1):
        """Wait until the PN532 is ready to receive commands.
        
        Args:
            timeout (float): Time to wait in seconds
            
        Returns:
            bool: True if ready, False if timeout occurred
        """
        start = time.time()
        
        # Initial wait after a command
        time.sleep(0.05)
        
        # Check if ready
        while (time.time() - start) < timeout:
            try:
                # Write a status read command
                self.i2c.writeto(self.address, b'\x01')
                time.sleep(0.001)  # Brief pause
                
                # Read the status byte
                status = self.i2c.readfrom(self.address, 1)[0]
                
                # The PN532 responds with 0x01 when it's ready
                if status & 0x01:
                    return True
                
                if status == 0x00:
                    # Not ready yet
                    time.sleep(0.05)  # Wait a bit longer
                else:
                    if self.debug:
                        print("Unexpected status: ", hex(status))
            except OSError as e:
                if self.debug:
                    print("I2C error:", e)
                time.sleep(0.05)
        
        # Timeout occurred
        if self.debug:
            print("Wait ready timed out after", timeout, "seconds")
        return False
    
    def _wakeup(self):
        """Wake up the PN532 from power down or standby modes."""
        if self.debug:
            print("Waking up PN532")
        
        # Reset the I2C lock state
        self._i2c_lock = False
        
        # Send a dummy address write (no data)
        try:
            self.i2c.writeto(self.address, b'')
        except OSError:
            # This is expected sometimes
            pass
        
        # Wait a bit
        time.sleep(0.1)
        
        # Send wake-up sequence
        try:
            # For I2C, send a standard wake pattern
            self.i2c.writeto(self.address, b'\x55\x55\x00\x00\x00')
            time.sleep(0.01)
        except OSError:
            # Sometimes this fails, which is acceptable
            pass
        
        # Final wait for chip to stabilize
        time.sleep(0.5)