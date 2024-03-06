package main.t3;

import java.util.*;

/**
 * Artificial Intelligence responsible for playing the game of T3!
 * Implements the alpha-beta-pruning mini-max search algorithm
 */
public class T3Player {
    
    /**
     * Workhorse of an AI T3Player's choice mechanics that, given a game state,
     * makes the optimal choice from that state as defined by the mechanics of the
     * game of Tic-Tac-Total. Note: In the event that multiple moves have
     * equivalently maximal minimax scores, ties are broken by move col, then row,
     * then move number in ascending order (see spec and unit tests for more info).
     * The agent will also always take an immediately winning move over a delayed
     * one (e.g., 2 moves in the future).
     * 
     * @param state
     *            The state from which the T3Player is making a move decision.
     * @return The T3Player's optimal action.
     */
    public T3Action choose (T3State state) {
    	// get the possible actions we can take from this action
    	// get the utility scores of the possible transitions
    	// return the action with the best possible utility
    	
    	int bestScore = Integer.MIN_VALUE;
    	Map<T3Action, T3State> possibleTransitions = state.getTransitions();
    	T3Action temp = new T3Action(-1,-1,-1);
    	for(Map.Entry<T3Action, T3State> transition : possibleTransitions.entrySet()) {
			int score = AlphaBetaPruning(transition.getValue(), Integer.MIN_VALUE, Integer.MAX_VALUE, true);
			if(score > bestScore) {
				bestScore = score;
				temp = transition.getKey();
			}
		}  	
    	return temp;
    }
    
    public int AlphaBetaPruning(T3State state, int alpha, int beta, boolean isMaximize) {
    	if(state.isTie()) 
    		return 0;
    	if(state.isWin()) {
    		if(isMaximize)
    			return 1;
    		else
    			return -1;
    	}
    	if(isMaximize) {
    		int v = Integer.MIN_VALUE;
        	Map<T3Action, T3State> possibleTransitions = state.getTransitions();
    		for(Map.Entry<T3Action, T3State> transition : possibleTransitions.entrySet()) {
    			v = max(v,AlphaBetaPruning(transition.getValue(), alpha, beta, false));
    			alpha = max(alpha, v);
    			if(beta <= alpha)
    				break;
    		}
    		return v;
    	}
    	else {
    		int v = Integer.MAX_VALUE;
    		Map<T3Action, T3State> possibleTransitions = state.getTransitions();
    		for(Map.Entry<T3Action, T3State> transition : possibleTransitions.entrySet()) {
    			v = min(v,AlphaBetaPruning(transition.getValue(), alpha, beta, true));
    			beta = min(beta, v);
    			if(beta <= alpha)
    				break;
    		}
    		return v;
    	}
    }
    
    private int max(int a, int b) {
    	return a > b ? a : b;
    }
    
    private int min(int a, int b) {
    	return a < b ? a : b;
    }
    
}

