package com.model.junction; 

/*Traffic Light stores the time spent on each colour of traffic light */
class TrafficLight{
    private int RedDuration;
    private int OrangeDuration;
    private int GreenDuration;

    /* Getters and setters for all three variables */
    public int getRedDuration(){
        return RedDuration;
    }
    public void setRedDuration(int redDuration){
        RedDuration = redDuration;
    }
    public int getOrangeDuration(){
        return OrangeDuration;
    }
    public void setOrangeDuration(int orangeDuration){
        OrangeDuration = orangeDuration;
    }
    public int getGreenDuration(){
        return GreenDuration;
    }
    public void setGreenDuration(int greenDuration){
        GreenDuration = greenDuration;
    } 

    /* Determines the sequence of traffic lights 
    For now, it is set to 30 seconds on each, but this can be changed to a proper algorithm*/
    public void determineSequence(){
        setRedDuration(30);
        setOrangeDuration(30);
        setGreenDuration(30);
    }
}