#include <Servo.h>

Servo microwave;
Servo lock;

void setup() {
  Serial.begin(9600);
  microwave.attach(9);
  lock.attach(10);
  microwave.write(45);
  lock.write(180);
}

void loop() {
  if(Serial.available()){
    char i = Serial.read();
    if(i=='1'){ // microwave
      
      Serial.println("on");
      microwave.write(90);
      delay(500);
      Serial.write("off");
      microwave.write(45);
      delay(500);
      
    } else if(i=='3'){ // lock
      
      Serial.println("lock");
      lock.write(180);
      delay(500);
      lock.write(90);
      
    } else if(i=='2'){ // unlock
      
      Serial.println("unlock");
      lock.write(90);
      delay(500);
      lock.write(0);
      
    }
  }
}
