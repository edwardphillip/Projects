package main.pathfinder.informed.trikey;

import java.lang.Math;
import java.util.*;

/**
 * Maze Pathfinding algorithm that implements a basic, uninformed, breadth-first
 * tree search.
 */
public class Pathfinder {

    /**
     * Given a MazeProblem, which specifies the actions and transitions available in
     * the search, returns a solution to the problem as a sequence of actions that
     * leads from the initial state to the collection of all three key pieces.
     * 
     * @param problem A MazeProblem that specifies the maze, actions, transitions.
     * @return A List of Strings representing actions that solve the problem of the
     *         format: ["R", "R", "L", ...]
     */
    public static List<String> solve(MazeProblem problem) {
    	Queue<SearchTreeNode> openList = new PriorityQueue<SearchTreeNode>(new CustomComparator());
        // >> [AF] Data structure choice alert! We use this (what we called the "graveyard" in class) to do
        // lots of membership tests -- a List will perform those in O(n) time whereas a HashSet in O(1)!
    	List<MazeState> closedList = new LinkedList<MazeState>();
    	
    	SearchTreeNode initialState = new SearchTreeNode(problem.getInitial(), null, null, problem.getKeyStates(), 0, 0);
    	openList.add(initialState);
    	
    	for(MazeState key : initialState.keyStates) {
    		Map<String, MazeState> possibleTransition = problem.getTransitions(key);
    		if(possibleTransition.size() == 0)
    			return null;
		}
    	
        // >> [AF] Oh no! You're mingling tabs and spaces to indent below -- you should use ONLY
        // spaces (or ONLY tabs, but we prefer spaces in this department due to their unified display
        // across editors). Most IDEs can be configured to replace tabs with spaces, see me or a TA
        // for help setting that up, but it *is* a big stylistic deal. (-1)
    	while(!openList.isEmpty()) {
    		SearchTreeNode current = openList.poll();
    		closedList.add(current.state);
    			
			if(current.keyStates.isEmpty()) {
                // >> [AF] You have a lot of code here to recover the solution that should be instead
                // in its own helper method
				List<String> solution = new ArrayList<String>();
                while(current.action != null) {
                    solution.add(current.action);
                    current = current.parent;
                }
                for (int i = 0, j = solution.size() - 1; i < j; i++) {
                    solution.add(i, solution.remove(j));
                    
                }
                return solution;
			}
    			
    		
    		Map<String, MazeState> childs = problem.getTransitions(current.state);
    		for(Map.Entry<String, MazeState> point : childs.entrySet()) {
                // >> [AF] Never use temp as a variable name -- don't know what this thing is meant to represent
                // or hold or do (-0.5)
    			Set<MazeState> temp = new HashSet<>(current.keyStates);   					
    			
    			int g = current.g + problem.getCost(point.getValue());
    			int h = heuristic(point.getValue(), temp);
    			int f = g + h;
    			
    			if(temp.contains(point.getValue()))
    				temp.remove(point.getValue());
    			
                // >> [AF] No check that this is in the closeList already?
    			SearchTreeNode newGen = new SearchTreeNode(point.getValue(), point.getKey(), current, temp, g, f);	
    			openList.add(newGen);
    		}
    	}
    	return null;   
    }
    
    // >> [AF] OK, but making a Comparator object is usually when you might want the objects
    // being compared to be compared in different ways -- for us, we always want SearchTreeNodes
    // compared based on their priority, so better to have the SearchTreeNode class implement
    // the Comparable interface / compareTo method instead.
    static class CustomComparator implements Comparator<SearchTreeNode>{
    	public int compare(SearchTreeNode a, SearchTreeNode b) {
    		return a.f > b.f ? 1 : -1;
    	}
    }
    
    // >> [AF] Provide proper Javadocs for ALL methods, including helpers you write (-0.25)
    private static int heuristic(MazeState currentState, Set<MazeState> keyStates) {
        // >> [AF] Better: Use Integer.MAX_VALUE
    	int h = 999;
    	for(MazeState keyState : keyStates) {
    		int temp = Math.abs(keyState.row()-currentState.row()) + Math.abs(keyState.col()-currentState.col());
    		if(temp<h)
    			h = temp;
    	}
    	return h;
    }

    /**
     * SearchTreeNode private static nested class that is used in the Search
     * algorithm to construct the Search tree.
     * [!] You may do whatever you want with this class -- in fact, you'll need 
     * to add a lot for a successful and efficient solution!
     */
    private static class SearchTreeNode {

        MazeState state;
        String action;
        SearchTreeNode parent;
        Set<MazeState> keyStates;
        int g;
        int f;

        /**
         * Constructs a new SearchTreeNode to be used in the Search Tree.
         * 
         * @param state  The MazeState (row, col) that this node represents.
         * @param action The action that *led to* this state / node.
         * @param parent Reference to parent SearchTreeNode in the Search Tree.
         */
        SearchTreeNode(MazeState state, String action, SearchTreeNode parent, Set<MazeState> keyStates, int g, int f) {
            this.state = state;
            this.action = action;
            this.parent = parent;
            this.keyStates = keyStates;
            this.g = g;
            this.f = f;
        }

    }

}

// ===================================================
// >>> [AF] Summary
// A solid submission that shows strong command of
// programming fundamentals, generally good style,
// and a good grasp on the problem and supporting
// theory of A*. Indeed, there is definitely
// a lot to like in what you have above, but
// I think you also ran out of time to test your
// submission adequately and expose / fix its logic 
// problems on more general mazes. Give yourself more
// time for future submissions and you'll be golden!
// ---------------------------------------------------
// >>> [AF] Style Checklist
// [X] = Good, [~] = Mixed bag, [ ] = Needs improvement
// 
// [~] Variables and helper methods named and used well
// [ ] Proper and consistent indentation and spacing
// [ ] Proper JavaDocs provided for ALL methods
// [X] Logic is adequately simplified
// [X] Code repetition is kept to a minimum
// ---------------------------------------------------
// Correctness:         82 / 100 (-1.5 / missed unit test)
// Style Penalty:       -1.75
// Total:               80.25 / 100
// ===================================================
