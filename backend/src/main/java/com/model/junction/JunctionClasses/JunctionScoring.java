package com.model.junction.JunctionClasses;

import java.text.DecimalFormat;

public class JunctionScoring {


  double quarterScores[] = new double[4]; // quarter Score array, indexes are North, East, South, West

  /* calculate a score for a quarter, the score is effected by cars remaining after the simulation time */
  public void quarterScore(nt directionIndex,double outboundVph, double SimulationTime, long averageWaitTimeInMS, long maximumWaitingTimeInMS, long maximumQueueLength, int carsEntered, int totalCarsExited, double weightingMWT,  double weightingAWT, double weightingMQL) {


    double worstMaximumWaitingTime= SimulationTime*15*1000;
    double worstAverageWaitingTime= SimulationTime*15*1000;
    int worstMaximumQueueLength= outboundVph;

    double score = weightingMWT * (1 - averageWaitTimeInMS / worstAverageWaitingTime) + weightingMWT * (1 - maximumWaitingTimeInMS / worstMaximumWaitingTime) + weightingMQL * (1 - maximumQueueLength / worstMaximumQueueLength);
    DecimalFormat df = new DecimalFormat("#.##");      
    score = Double.valueOf(df.format(score*100));
   
    double remainingCarsRate= 1 - (totalCarsExited / (double)carsEntered);  
    remainingCarsRate =Double.valueOf(df.format(remainingCarsRate*100));

    quarterScores[directionIndex]= score-remainingCarsRate;

  }

  /* Harmonic mean approach, penalize very small quarter scores */
  public double junctionScore() {

    return 4/((1/quarterScores[0])+(1/quarterScores[1])+(1/quarterScores[2])+(1/quarterScores[3]));

  }



}
