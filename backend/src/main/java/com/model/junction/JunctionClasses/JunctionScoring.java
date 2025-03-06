package com.model.junction.JunctionClasses;

import java.text.DecimalFormat;

public class JunctionScoring {
  double quarterScores[] = new double[4]; // quarter Score array, indexes are North, East, South, West

  /* calculate a score for a quarter, the score is effected by cars remaining after the simulation time */
  public void quarterScore(int directionIndex,double outboundVph, int simulationTime, long averageWaitTimeInMS, long maximumWaitingTimeInMS, long maximumQueueLength, double weightingMWT,  double weightingAWT, double weightingMQL) {

    /* used for Normalization*/ 
    double worstMaximumWaitingTime = simulationTime * 15 * 1000;
    double worstAverageWaitingTime = simulationTime * 15 * 1000;
    double worstMaximumQueueLength = outboundVph;

    double score = weightingAWT * (1 - averageWaitTimeInMS / worstAverageWaitingTime) + weightingMWT * (1 - maximumWaitingTimeInMS / worstMaximumWaitingTime) + weightingMQL * (1 - maximumQueueLength / worstMaximumQueueLength);
    DecimalFormat df = new DecimalFormat("#.##");      
    score = Double.valueOf(df.format(score*100));

    quarterScores[directionIndex]= score;
  }

  /* Harmonic mean approach, penalize very small quarter scores */
  public double junctionScore() {
    System.out.println("Quarter scores are : " + quarterScores[0] + " " + quarterScores[1] + " " + quarterScores[2] + " " + quarterScores[3]);
    return 4/((1/quarterScores[0])+(1/quarterScores[1])+(1/quarterScores[2])+(1/quarterScores[3]));
  }
}
