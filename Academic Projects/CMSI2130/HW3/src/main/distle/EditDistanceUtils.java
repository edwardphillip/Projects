package main.distle;

import java.util.*;

public class EditDistanceUtils {
    
    /**
     * Returns the completed Edit Distance memoization structure, a 2D array
     * of ints representing the number of string manipulations required to minimally
     * turn each subproblem's string into the other.
     * 
     * @param s0 String to transform into other
     * @param s1 Target of transformation
     * @return Completed Memoization structure for editDistance(s0, s1)
     */
    public static int[][] getEditDistTable (String s0, String s1) {
    	int rowlength = s0.length() + 1;
    	int collength = s1.length() + 1;
    	
    	int[][] distTable = new int[rowlength][collength];
    	
    	for(int i = 0; i<rowlength; i++)
    		distTable[i][0] = i;
    	for(int j = 0; j<collength; j++)
    		distTable[0][j] = j;
    	
    	for(int i = 1; i<rowlength; i++) {
    		for(int j = 1; j<collength; j++) {
    			int insertion = distTable[i-1][j] + 1;
    			int deletion = distTable[i][j-1] + 1;
    			int replacement = distTable[i-1][j-1] + (s0.charAt(i-1)==s1.charAt(j-1) ? 0 : 1);
    			int transposition = Integer.MAX_VALUE;
    			if(i>=2 && j>=2 && s0.charAt(i-1)==s1.charAt(j-2) && s0.charAt(i-2)==s1.charAt(j-1))
    				transposition = distTable[i-2][j-2]+1;
    			
    			int field = insertion;
    			if(deletion<field)
    				field = deletion;
    			if(replacement<field)
    				field = replacement;
    			if(transposition<field)
    				field = transposition;
    			
    			distTable[i][j] = field;
    		}
    	}
    	
    	return distTable;
    }
    
    /**
     * Returns one possible sequence of transformations that turns String s0
     * into s1. The list is in top-down order (i.e., starting from the largest
     * subproblem in the memoization structure) and consists of Strings representing
     * the String manipulations of:
     * <ol>
     *   <li>"R" = Replacement</li>
     *   <li>"T" = Transposition</li>
     *   <li>"I" = Insertion</li>
     *   <li>"D" = Deletion</li>
     * </ol>
     * In case of multiple minimal edit distance sequences, returns a list with
     * ties in manipulations broken by the order listed above (i.e., replacements
     * preferred over transpositions, which in turn are preferred over insertions, etc.)
     * @param s0 String transforming into other
     * @param s1 Target of transformation
     * @param table Precomputed memoization structure for edit distance between s0, s1
     * @return List that represents a top-down sequence of manipulations required to
     * turn s0 into s1, e.g., ["R", "R", "T", "I"] would be two replacements followed
     * by a transposition, then insertion.
     */
    public static List<String> getTransformationList (String s0, String s1, int[][] table) {
    	List<String> transformationList = new ArrayList<String>();
    	int i = s0.length();
    	int j = s1.length();
    	
    	while(!(i==0 && j==0)) {
    		if(table[i][j] == 0)
    			break;
    		
    		String transformation = new String();
    		// >> [KT] camelCase is the naming convention in Java, not snake_case (-0.5)
    		int deletion_trackback = Integer.MAX_VALUE;
    		if(i >= 1)
    			deletion_trackback = table[i-1][j];
    		
    		int insertion_trackback = Integer.MAX_VALUE;
    		if(j >= 1)
    			insertion_trackback = table[i][j-1];
    		
    		int transposition_trackback = Integer.MAX_VALUE;
    		if(i>=2 && j>=2 && s0.charAt(i-1)==s1.charAt(j-2) && s0.charAt(i-2)==s1.charAt(j-1))
				transposition_trackback = table[i-2][j-2];
    		
    		int replacement_trackback = Integer.MAX_VALUE;
    		if(i>=1 && j>=1)
    			replacement_trackback = table[i-1][j-1];
    		
    		
    		int[] array = new int[4];
    		array[0] = replacement_trackback;
    		array[1] = transposition_trackback;
    		array[2] = insertion_trackback;
    		array[3] = deletion_trackback;
    		

    	    int index = 0;
    	    int min = array[index];

    	    for (int a = 1; a < array.length; a++){
    	        if (array[a] < min){
    	        min = array[a];
    	        index = a;
    	        }
    	    }
    	    
    	    int temp_value = table[i][j];
    	    // >> [KT] This function is doing a lot! Try to separate tasks into helper functions so that 
	    // you can debug more easily, so that collaborators can better understand your code, and so 
    	    // that your code may be more easily reused (-0.25)
    	    switch(index) {
    	    case 0:
    	    	i = i-1;
    	    	j = j-1;
    	    	transformation = "R";
    	    	break;
    	    case 1:
    	    	i = i-2;
    	    	j = j-2;
    	    	transformation = "T";
    	    	break;
    	    case 2:
    	    	j = j-1;
    	    	transformation = "I";
    	    	break;
    	    case 3:
    	    	i = i-1;
    	    	transformation = "D";
    	    	break;
	    // >> [KT] Inconsistent indentation (-0.25)
	    	default:
	    		break;
    	    }
    	    
    	    if(table[i][j] == temp_value)
    	    	continue;
    		transformationList.add(transformation);
    		
    	}       
    	
    	return transformationList;

    }
    
    /**
     * Returns the edit distance between the two given strings: an int
     * representing the number of String manipulations (Insertions, Deletions,
     * Replacements, and Transpositions) minimally required to turn one into
     * the other.
     * 
     * @param s0 String to transform into other
     * @param s1 Target of transformation
     * @return The minimal number of manipulations required to turn s0 into s1
     */
    public static int editDistance (String s0, String s1) {
        if (s0.equals(s1)) { return 0; }
        return getEditDistTable(s0, s1)[s0.length()][s1.length()];
    }
    
    /**
     * See {@link #getTransformationList(String s0, String s1, int[][] table)}.
     */
    public static List<String> getTransformationList (String s0, String s1) {
        return getTransformationList(s0, s1, getEditDistTable(s0, s1));
    }

}

// ===================================================
// >>> [KT] Summary
// Excellent submission that has a ton to like and was
// obviously well-tested. Generally clean style, shows
// strong command of programming foundations alongside
// data structure and algorithmic concepts, though there
// is some improvement that can be made regarding use of 
// helper methods. Keep up the great work!
// ---------------------------------------------------
// >>> [KT] Style Checklist
// [X] = Good, [~] = Mixed bag, [ ] = Needs improvement
//
// [~] Variables and helper methods named and used well
// [~] Proper and consistent indentation and spacing
// [X] Proper JavaDocs provided for ALL methods
// [X] Logic is adequately simplified
// [X] Code repetition is kept to a minimum
// ---------------------------------------------------
// Correctness:          100 / 100
// -> EditDistUtils:     20 / 20  (-2 / missed test)
// -> DistlePlayer:      273 / 265 (-0.5 / below threshold; max -25)
// Style Penalty:       -1
// Total:                99 / 100
// ===================================================
