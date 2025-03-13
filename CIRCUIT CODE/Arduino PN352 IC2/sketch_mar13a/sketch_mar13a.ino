#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

#define PN532_IRQ   (2)
#define PN532_RESET (3)

Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

const char message[] = "Your custom message here";

void createNDEFTextMessage(const char* text, uint8_t* ndefBuffer, uint8_t* ndefLength) {
  uint8_t textLength = strlen(text);
  uint8_t prefixLength = 9;
  uint8_t payloadLength = 3 + textLength;
  
  ndefBuffer[0] = 0x03;
  ndefBuffer[1] = payloadLength + 4;
  
  ndefBuffer[2] = 0xD1;
  ndefBuffer[3] = 0x01;
  ndefBuffer[4] = payloadLength;
  ndefBuffer[5] = 'T';
  
  ndefBuffer[6] = 0x02;
  ndefBuffer[7] = 'e';
  ndefBuffer[8] = 'n';
  
  memcpy(&ndefBuffer[prefixLength], text, textLength);
  
  ndefBuffer[prefixLength + textLength] = 0xFE;
  
  *ndefLength = prefixLength + textLength + 1;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Starting PN532 to write NDEF message to card");
  
  nfc.begin();
  
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("PN532 not found");
    while (1);
  }
  
  Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX); 
  Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
  Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
  
  nfc.SAMConfig();
  
  Serial.println("Bring your S50 card or RFID tag to the reader...");
}

void loop() {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);
  
  if (success) {
    Serial.println("Card detected!");
    Serial.print("UID: ");
    for (uint8_t i=0; i < uidLength; i++) {
      Serial.print(" 0x"); Serial.print(uid[i], HEX); 
    }
    Serial.println("");
    
    uint8_t keya[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };
    
    if (uidLength == 4) {
      success = nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 4, 0, keya);
      
      if (success) {
        Serial.println("Authentication successful - Preparing NDEF message...");
        
        uint8_t block0[16] = { 
          uid[0], uid[1], uid[2], uid[3],
          uid[4], uid[5], 0x08, 0x04,
          0x00, 0x00, 0x00, 0x00,
          0xC1, 0x01, 0x00, 0x00
        };
        nfc.mifareclassic_WriteDataBlock(1, block0);
        
        uint8_t ndefData[48];
        uint8_t ndefLength;
        
        createNDEFTextMessage(message, ndefData, &ndefLength);
        
        uint8_t block4[16];
        uint8_t block5[16];
        uint8_t block6[16];
        
        memset(block4, 0, 16);
        memset(block5, 0, 16);
        memset(block6, 0, 16);
        
        uint8_t bytesToWrite = ndefLength;
        uint8_t bytesWritten = 0;
        
        uint8_t len = min(bytesToWrite, 16);
        memcpy(block4, ndefData, len);
        bytesWritten += len;
        bytesToWrite -= len;
        
        if (bytesToWrite > 0) {
          len = min(bytesToWrite, 16);
          memcpy(block5, ndefData + bytesWritten, len);
          bytesWritten += len;
          bytesToWrite -= len;
        }
        
        if (bytesToWrite > 0) {
          len = min(bytesToWrite, 16);
          memcpy(block6, ndefData + bytesWritten, len);
        }
        
        success = nfc.mifareclassic_WriteDataBlock(4, block4);
        if (success) {
          Serial.println("Block 4 written successfully");
          
          success = nfc.mifareclassic_WriteDataBlock(5, block5);
          if (success) {
            Serial.println("Block 5 written successfully");
            
            success = nfc.mifareclassic_WriteDataBlock(6, block6);
            if (success) {
              Serial.println("Block 6 written successfully");
              Serial.println("NDEF message written completely!");
              Serial.println("Now you can read the card with your mobile phone.");
            }
          }
        }
        
        if (!success) {
          Serial.println("Error writing NDEF blocks");
        }
      } else {
        Serial.println("Authentication failed - Is this a Mifare Classic card?");
      }
    } else {
      Serial.println("This doesn't appear to be a Mifare Classic card");
    }
    
    Serial.println("Done. Waiting for next card.");
    delay(3000);
  }
  
  delay(500);
}