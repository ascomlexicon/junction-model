
/*  scoring for a junction quarter*/
public class JunctionScoring {

  public double quarterScore(double northboundVpH, double SimulationTime, long averageWaitTimeInSeconds, long maximumWaitingTimeInSeconds, long maximumQueueLength, double weightingMWT,  double weightingAWT, double weightingMQL) {

    worstMaximumWaitingTime= SimulationTime*15;
    worstAverageWaitingTime= SimulationTime*15;
    worstMaximumQueueLength= northboundVpH;

    double score = weightingAWT * (1 - averageWaitTimeInSeconds / worstAverageWaitingTime) + weightingMWT * (1 - maximumWaitingTimeInSeconds / worstMaximumWaitingTime) + weightingMQL * (1 - maximumQueueLength / worstMaximumQueueLength);
    return score;

  } 



}

/*TODO: complete the scoring for the junction*/ 
// public class JunctionScoring {

//   // Attributes
//   private double northScore;
//   private double southScore;
//   private double eastScore;
//   private double westScore; 


// //parameter (flow rate to determine worst MQL, SimulationTime worst AWT/MWT, weightings, matrices)
//   public void quarterScore(....) {

//     double score = p1 * (1 - averageWaitTimeInSeconds / worstAverageWaitingTime) + p2 * (1 - maximumWaitingTimeInSeconds / worstMaximumWaitingTime) + p3 * (1 - maximumQueueLength / worstMaximumQueueLength);

//   } 


//   //Harmonic mean approach
//   public double junctionScore(....) {

//     	return 4/((1/northScore)+(1/southScore)+(1/eastScore)+(1/westScore);

//   }

// }
