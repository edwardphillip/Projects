 package main.csp;

import static main.csp.CSPSolver.nodeConsistency;
import static org.junit.Assert.fail;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * CSP: Calendar Satisfaction Problem Solver
 * Provides a solution for scheduling some n meetings in a given
 * period of time and according to some unary and binary constraints
 * on the dates of each meeting.
 */
public class CSPSolver {

    // Backtracking CSP Solver
    // --------------------------------------------------------------------------------------------------------------
	/**
     * Helper method for generating uniform domains for tests.
     * @param n Number of meeting variables in this CSP.
     * @param startRange Start date for the range of each variable's domain.
     * @param endRange End date for the range of each variable's domain.
     * @return The List of Meeting-indexed MeetingDomains.
     */
	public static List<MeetingDomain> generateDomains (int n, LocalDate startRange, LocalDate endRange) {
        List<MeetingDomain> domains = new ArrayList<>();
        while (n > 0) {
            domains.add(new MeetingDomain(startRange, endRange));
            n--;
        }
        return domains;
    }
	
    /**
     * Public interface for the CSP solver in which the number of meetings,
     * range of allowable dates for each meeting, and constraints on meeting
     * times are specified.
     * @param nMeetings The number of meetings that must be scheduled, indexed from 0 to n-1
     * @param rangeStart The start date (inclusive) of the domains of each of the n meeting-variables
     * @param rangeEnd The end date (inclusive) of the domains of each of the n meeting-variables
     * @param constraints Date constraints on the meeting times (unary and binary for this assignment)
     * @return A list of dates that satisfies each of the constraints for each of the n meetings,
     *         indexed by the variable they satisfy, or null if no solution exists.
     */
    public static List<LocalDate> solve (int nMeetings, LocalDate rangeStart, LocalDate rangeEnd, Set<DateConstraint> constraints) {    	
    	List<MeetingDomain> domains = generateDomains(nMeetings, rangeStart, rangeEnd);
        nodeConsistency(domains, constraints);
        arcConsistency(domains, constraints);
    	return recursive_backtracking(new ArrayList<LocalDate>(), nMeetings, domains, constraints);
    }
    
    public static List<LocalDate> recursive_backtracking(List<LocalDate> assignment, int nMeetings, List<MeetingDomain> domain, Set<DateConstraint> constraints){
    	if(assignment.size() == nMeetings)
    		return assignment;
    	int var = assignment.size();
    	for(LocalDate date : domain.get(var).domainValues) {
    		boolean isConsistent = true;
    		for(DateConstraint eachConstraint : constraints) {
    			if(eachConstraint.arity() == 1 && var != eachConstraint.L_VAL)
    				continue;
    			else if(eachConstraint.arity() == 2){
    				if(eachConstraint.L_VAL > ((BinaryDateConstraint)eachConstraint).R_VAL)
    					eachConstraint = new BinaryDateConstraint(((BinaryDateConstraint)eachConstraint).R_VAL, eachConstraint.getSymmetricalOp(), eachConstraint.L_VAL);

    				if(var != eachConstraint.L_VAL && var != ((BinaryDateConstraint)eachConstraint).R_VAL)
    					continue;
    				
    				if(((BinaryDateConstraint) eachConstraint).R_VAL > assignment.size())
    					continue;
    			}
    			
				LocalDate leftDate = (eachConstraint.arity() == 1) ? date : assignment.get(eachConstraint.L_VAL);
    			LocalDate rightDate = (eachConstraint.arity() == 1) 
                            ? ((UnaryDateConstraint) eachConstraint).R_VAL 
                            : (var == ((BinaryDateConstraint)eachConstraint).R_VAL) ? date : assignment.get(((BinaryDateConstraint) eachConstraint).R_VAL);
    			
    			if (!eachConstraint.isSatisfiedBy(leftDate, rightDate)) {
	                isConsistent = false;
	                break;
	            }			
    		}
    		if(isConsistent) {
    			assignment.add(date);
    			List<LocalDate> result = recursive_backtracking(assignment, nMeetings, domain, constraints);
    			if(result != null)
    				return result;
    			assignment.remove(var);
    		}
    	}
    	return null;    	
    }
    
    
    
    // Filtering Operations
    // --------------------------------------------------------------------------------------------------------------
    
    /**
     * Enforces node consistency for all variables' domains given in varDomains based on
     * the given constraints. Meetings' domains correspond to their index in the varDomains List.
     * @param varDomains List of MeetingDomains in which index i corresponds to D_i
     * @param constraints Set of DateConstraints specifying how the domains should be constrained.
     * [!] Note, these may be either unary or binary constraints, but this method should only process
     *     the *unary* constraints! 
     */
    public static void nodeConsistency (List<MeetingDomain> varDomains, Set<DateConstraint> constraints) {
    	for(DateConstraint eachConstraint : constraints) {
    		if(eachConstraint.arity() == 2)
    			continue;
    		
			Set<LocalDate> newDomain = new HashSet<LocalDate>();
			for(LocalDate date : varDomains.get(eachConstraint.L_VAL).domainValues)
				if(eachConstraint.isSatisfiedBy(date, ((UnaryDateConstraint)eachConstraint).R_VAL))
					newDomain.add(date);
			
			MeetingDomain temp = new MeetingDomain(varDomains.get(eachConstraint.L_VAL));
			temp.domainValues = newDomain;
			varDomains.set(eachConstraint.L_VAL, temp);
    	}
    }
    
    /**
     * Enforces arc consistency for all variables' domains given in varDomains based on
     * the given constraints. Meetings' domains correspond to their index in the varDomains List.
     * @param varDomains List of MeetingDomains in which index i corresponds to D_i
     * @param constraints Set of DateConstraints specifying how the domains should be constrained.
     * [!] Note, these may be either unary or binary constraints, but this method should only process
     *     the *binary* constraints using the AC-3 algorithm! 
     */
    public static void arcConsistency (List<MeetingDomain> varDomains, Set<DateConstraint> constraints) {
    	Queue<Arc> queueArc = new LinkedList<Arc>();
    	for(DateConstraint eachConstraint : constraints) {
    		if(eachConstraint.arity() == 1)
    			continue;
    		queueArc.add(new Arc(eachConstraint.L_VAL, ((BinaryDateConstraint)eachConstraint).R_VAL, eachConstraint));
    		queueArc.add(new Arc(((BinaryDateConstraint)eachConstraint).R_VAL, eachConstraint.L_VAL, eachConstraint));
    	}
    	
    	while(!queueArc.isEmpty()) {
    		Arc temp = queueArc.poll();
    		if(isInconsistentValuesRemoved(temp, varDomains)) {
    			for(DateConstraint eachConstraint : constraints) {
    				if(eachConstraint.arity() == 1)
    					continue;
    				if(eachConstraint.L_VAL != temp.TAIL && ((BinaryDateConstraint)eachConstraint).R_VAL != temp.TAIL)
    					continue;
    				if(eachConstraint.L_VAL == temp.TAIL)
    					queueArc.add(new Arc(((BinaryDateConstraint)eachConstraint).R_VAL, temp.TAIL, eachConstraint));
    				else
    					queueArc.add(new Arc(eachConstraint.L_VAL, temp.TAIL, eachConstraint));
    			}	
    		}	
    	}
    }
    
    public static boolean isInconsistentValuesRemoved(Arc arc, List<MeetingDomain> varDomains) {
    	List<LocalDate> toBeRemoved = new ArrayList<LocalDate>();
    	boolean isRemoved = false;
    	for(LocalDate date : varDomains.get(arc.TAIL).domainValues) {
    		boolean canSatisfy = false;
    		for(LocalDate date2 : varDomains.get(arc.HEAD).domainValues) {
				if(arc.TAIL == arc.CONSTRAINT.L_VAL ? arc.CONSTRAINT.isSatisfiedBy(date, date2) : arc.CONSTRAINT.isSatisfiedBy(date2, date)) {
    				canSatisfy = true;
    				break;
    			}
    		}
    		if(!canSatisfy) {
    			toBeRemoved.add(date);
    			isRemoved = true;    			
    		}	
    	}
    	
    	if(isRemoved)
    		for(LocalDate date : toBeRemoved)
    			varDomains.get(arc.TAIL).domainValues.remove(date);
    	
    	return isRemoved;
    }
    
    
    /**
     * Private helper class organizing Arcs as defined by the AC-3 algorithm, useful for implementing the
     * arcConsistency method.
     * [!] You may modify this class however you'd like, its basis is just a suggestion that will indeed work.
     */
    private static class Arc {
        
        public final DateConstraint CONSTRAINT;
        public final int TAIL, HEAD;
        
        /**
         * Constructs a new Arc (tail -> head) where head and tail are the meeting indexes
         * corresponding with Meeting variables and their associated domains.
         * @param tail Meeting index of the tail
         * @param head Meeting index of the head
         * @param c Constraint represented by this Arc.
         * [!] WARNING: A DateConstraint's isSatisfiedBy method is parameterized as:
         * isSatisfiedBy (LocalDate leftDate, LocalDate rightDate), meaning L_VAL for the first
         * parameter and R_VAL for the second. Be careful with this when creating Arcs that reverse
         * direction. You may find the BinaryDateConstraint's getReverse method useful here.
         */
        public Arc (int tail, int head, DateConstraint c) {
            this.TAIL = tail;
            this.HEAD = head;
            this.CONSTRAINT = c;
        }
        
        @Override
        public boolean equals (Object other) {
            if (this == other) { return true; }
            if (this.getClass() != other.getClass()) { return false; }
            Arc otherArc = (Arc) other;
            return this.TAIL == otherArc.TAIL && this.HEAD == otherArc.HEAD && this.CONSTRAINT.equals(otherArc.CONSTRAINT);
        }
        
        @Override
        public int hashCode () {
            return Objects.hash(this.TAIL, this.HEAD, this.CONSTRAINT);
        }
        
        @Override
        public String toString () {
            return "(" + this.TAIL + " -> " + this.HEAD + ")";
        }
        
    }
    
}
