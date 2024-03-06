package main.compression;

import java.util.*;
import java.io.ByteArrayOutputStream; // Optional

/**
 * Huffman instances provide reusable Huffman Encoding Maps for
 * compressing and decompressing text corpi with comparable
 * distributions of characters.
 */
// >> [TN] Mixing tabs and spaces is a big no. To avoid the mix up, you can configure your 
// text editor or IDE to use spaces for tabs (-3)
public class Huffman {
    
    // -----------------------------------------------
    // Construction
    // -----------------------------------------------

    private HuffNode trieRoot;
    // TreeMap chosen here just to make debugging easier
    private TreeMap<Character, String> encodingMap;
    // Character that represents the end of a compressed transmission
    private static final char ETB_CHAR = 23;
    
    /**
     * Creates the Huffman Trie and Encoding Map using the character
     * distributions in the given text corpus
     * 
     * @param corpus A String representing a message / document corpus
     *        with distributions over characters that are implicitly used
     *        throughout the methods that follow. Note: this corpus ONLY
     *        establishes the Encoding Map; later compressed corpi may
     *        differ.
     */
    
    public Huffman (String corpus) {
        // >> [TN] The readability would be greatly improved by decomposing this fucntion 
        // into helper methods. (-2)
    	Map<Character, Integer> distributionTable = new HashMap<Character, Integer>();
    	
    	for(int i = 0; i<corpus.length(); i++) { 		
    		if(distributionTable.keySet().contains(corpus.charAt(i))) 
    			distributionTable.put(corpus.charAt(i), distributionTable.get(corpus.charAt(i)) + 1);      			
    		else 
    			distributionTable.put(corpus.charAt(i), 1);	
    	}
    	distributionTable.put(ETB_CHAR, 1);
    	
    	PriorityQueue<HuffNode> priorityQueue = new PriorityQueue<HuffNode>();
    	
    	for(Map.Entry<Character, Integer> entry : distributionTable.entrySet()) {
    		HuffNode huffNode = new HuffNode(entry.getKey(), entry.getValue());
    		priorityQueue.add(huffNode);
    	}
    	
    	while(priorityQueue.size() > 1) {
    		HuffNode zeroChild = priorityQueue.poll();
    		HuffNode oneChild = priorityQueue.poll();
            // >> [TN] Remember there's a tiebreaking criteria that, when there's equal priority
            // we tiebreak by the earliest character of it's subtree. This likely led ot failing 
            // some of the test cases where tiebreaking was needed. Keeping track of that character
            // when making a new parent now would be your best bet
    		HuffNode parent = new HuffNode(Character.MIN_VALUE, zeroChild.count + oneChild.count);
    		parent.oneChild = oneChild;
    		parent.zeroChild = zeroChild;
    		priorityQueue.add(parent);	
    	}
    	trieRoot = priorityQueue.poll();
    	
    	encodingMap = new TreeMap<Character, String>();
    	generateEncodingMap(trieRoot, ""); 
    }
    
    public void generateEncodingMap(HuffNode root, String s){
        if (root.isLeaf()) {
            encodingMap.put(root.character, s);
            return;
        }
        generateEncodingMap(root.zeroChild, s + "0");
        generateEncodingMap(root.oneChild, s + "1");
    }
    
    
    // -----------------------------------------------
    // Compression
    // -----------------------------------------------
    
    /**
     * Compresses the given String message / text corpus into its Huffman coded
     * bitstring, as represented by an array of bytes. Uses the encodingMap
     * field generated during construction for this purpose.
     * 
     * @param message String representing the corpus to compress.
     * @return {@code byte[]} representing the compressed corpus with the
     *         Huffman coded bytecode. Formatted as:
     *         (1) the bitstring containing the message itself, (2) possible
     *         0-padding on the final byte.
     */
    // >> [TN] This function also could use some helpers to break down
    // each step to make it more readable
    public byte[] compress (String message) {
        ArrayList<String> bitString = new ArrayList<String>();
        message += ETB_CHAR;
        String bitStringTemp = ""; 
        for(int i = 0; i < message.length(); i++) {
        	String encodedBits = encodingMap.get(message.charAt(i));
        	bitStringTemp += encodedBits;
        	if(bitStringTemp.length() >= 8) {
        		String bitStringPartial = bitStringTemp.substring(0, 8);
        		bitString.add(bitStringPartial);
        		bitStringTemp = bitStringTemp.substring(8);
        	}
        }
        
        int bitStringTempLength = bitStringTemp.length();
        if(bitStringTempLength < 8)
        	for(int i = 0; i < (8-bitStringTempLength); i++)
        		bitStringTemp += "0";
        bitString.add(bitStringTemp);

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        for(int i = 0; i < bitString.size(); i++)
        	output.write((byte) Integer.parseInt(bitString.get(i), 2));
        
        return output.toByteArray();
    }
    
    
    // -----------------------------------------------
    // Decompression
    // -----------------------------------------------
    
    /**
     * Decompresses the given compressed array of bytes into their original,
     * String representation. Uses the trieRoot field (the Huffman Trie) that
     * generated the compressed message during decoding.
     * 
     * @param compressedMsg {@code byte[]} representing the compressed corpus with the
     *        Huffman coded bytecode. Formatted as:
     *        (1) the bitstring containing the message itself, (2) possible
     *        0-padding on the final byte.
     * @return Decompressed String representation of the compressed bytecode message.
     */
    public String decompress (byte[] compressedMsg) {
    	String bitString = "";
    	for(int i = 0; i < compressedMsg.length; i++)
    		bitString += Integer.toBinaryString(compressedMsg[i] & 0xff);
    	while(bitString.length() % 8 != 0)
    		bitString = "0" + bitString;

    	String encodedETB = encodingMap.get(ETB_CHAR);
		int index = bitString.lastIndexOf(encodedETB);
		bitString = bitString.substring(0, index);	
    	
    	String decoded = "";
        for (int i = 0; i < bitString.length(); i++) {
            HuffNode tmpNode = trieRoot;
            while (!tmpNode.isLeaf() && i < bitString.length()) {
                if (bitString.charAt(i) == '1')
                    tmpNode = tmpNode.oneChild;
                else
                	tmpNode = tmpNode.zeroChild;
                i++;
            }
            if(tmpNode.character != Character.MIN_VALUE && tmpNode.character != ETB_CHAR) {
            	decoded += tmpNode.character;
            	i--;
            }
        }
        
    	return decoded;
    }
    
    
    // -----------------------------------------------
    // Huffman Trie
    // -----------------------------------------------
    
    /**
     * Huffman Trie Node class used in construction of the Huffman Trie.
     * Each node is a binary (having at most a left (0) and right (1) child), contains
     * a character field that it represents, and a count field that holds the 
     * number of times the node's character (or those in its subtrees) appear 
     * in the corpus.
     */
    private static class HuffNode implements Comparable<HuffNode> {
        
        HuffNode zeroChild, oneChild;
        char character;
        int count;
        
        HuffNode (char character, int count) {
            this.count = count;
            this.character = character;
        }
        
        public boolean isLeaf () {
            return this.zeroChild == null && this.oneChild == null;
        }
        
        public int compareTo (HuffNode other) {
            return this.count == other.count ? this.character - other.character : this.count - other.count;
        }
        
    }

}

// ===================================================
// >>> [TN] Summary
// Good start on each of the methods with edge cases
// not accounted for at the moment. Some of the functions
// could be improved with the use of helper methods.
// Making sure code is readable is almost as important
// as making it functional!
// ---------------------------------------------------
// >>> [TN] Style Checklist
// [X] = Good, [~] = Mixed bag, [ ] = Needs improvement
//
// [X] Variables and helper methods named and used well
// [X] Proper and consistent indentation and spacing
// [X] Proper JavaDocs provided for ALL methods
// [X] Logic is adequately simplified
// [X] Code repetition is kept to a minimum
// ---------------------------------------------------
// Correctness:         77.5 / 100 (-1.5 / missed unit test)
// Style Penalty:       -5
// Total:               72.5 / 100
// ===================================================