// ============================================
// STRING METHODS Examples
// ============================================

console.log('=== 1. String Properties ===');

const str = 'Hello, World!';

console.log('String:', str);
console.log('Length:', str.length);        // 13
console.log('First char:', str[0]);         // 'H'
console.log('Last char:', str[str.length - 1]); // '!'
console.log('Last with at():', str.at(-1)); // '!'

console.log('\n=== 2. Searching ===');

console.log('includes("World"):', str.includes('World'));    // true
console.log('includes("world"):', str.includes('world'));    // false (case-sensitive)
console.log('indexOf("o"):', str.indexOf('o'));              // 4 (first 'o')
console.log('lastIndexOf("o"):', str.lastIndexOf('o'));      // 8 (last 'o')
console.log('startsWith("Hello"):', str.startsWith('Hello')); // true
console.log('endsWith("!"):', str.endsWith('!'));             // true
console.log('indexOf("xyz"):', str.indexOf('xyz'));          // -1 (not found)

console.log('\n=== 3. Extracting Substrings ===');

// slice(start, end) - supports negative indices
console.log('slice(0, 5):', str.slice(0, 5));    // 'Hello'
console.log('slice(7):', str.slice(7));          // 'World!'
console.log('slice(-6):', str.slice(-6));        // 'orld!'
console.log('slice(-6, -1):', str.slice(-6, -1)); // 'orld'

// substring(start, end) - no negative indices
console.log('substring(7, 12):', str.substring(7, 12)); // 'World'
console.log('substring(5, 0):', str.substring(5, 0));   // 'Hello' (swaps if start > end)

console.log('\n=== 4. Case Conversion ===');

const text = 'Hello World';
console.log('toUpperCase():', text.toUpperCase()); // 'HELLO WORLD'
console.log('toLowerCase():', text.toLowerCase()); // 'hello world'

// Capitalize first letter
const word = 'javascript';
const capitalized = word[0].toUpperCase() + word.slice(1);
console.log('Capitalized:', capitalized); // 'Javascript'

console.log('\n=== 5. Trimming Whitespace ===');

const padded = '   Hello World   ';
console.log('Original:', `"${padded}"`);
console.log('trim():', `"${padded.trim()}"`);           // removes both
console.log('trimStart():', `"${padded.trimStart()}"`); // removes leading
console.log('trimEnd():', `"${padded.trimEnd()}"`);     // removes trailing

console.log('\n=== 6. Replacing ===');

const sentence = 'I love cats. Cats are great. Cats rule!';

// replace() - replaces first match
console.log('replace():', sentence.replace('Cats', 'Dogs'));
// 'I love cats. Dogs are great. Cats rule!'

// replaceAll() - replaces all matches
console.log('replaceAll():', sentence.replaceAll('Cats', 'Dogs'));
// 'I love cats. Dogs are great. Dogs rule!'

// With regex for case-insensitive
console.log('regex replace:', sentence.replace(/cats/gi, 'Dogs'));
// 'I love Dogs. Dogs are great. Dogs rule!'

// Replace with function
const result = sentence.replace(/cats/gi, match => match.toUpperCase());
console.log('Replace with fn:', result);

console.log('\n=== 7. Splitting ===');

const csv = 'Alice,Bob,Charlie,Diana';
const names = csv.split(',');
console.log('split(","):', names); // ['Alice', 'Bob', 'Charlie', 'Diana']

const joined = names.join(' | ');
console.log('join(" | "):', joined); // 'Alice | Bob | Charlie | Diana'

// Split into characters
const chars = 'hello'.split('');
console.log('split(""):', chars); // ['h', 'e', 'l', 'l', 'o']

// Split by limit
const parts = '1-2-3-4-5'.split('-', 3);
console.log('split with limit:', parts); // ['1', '2', '3']

console.log('\n=== 8. Padding ===');

// Useful for formatting numbers, dates, codes
console.log('padStart:', '5'.padStart(3, '0'));    // '005'
console.log('padEnd:', '5'.padEnd(3, '0'));        // '500'
console.log('padStart(10):', 'hello'.padStart(10)); // '     hello'
console.log('padEnd(10):', 'hello'.padEnd(10, '-')); // 'hello-----'

// Practical example: format hours and minutes
const hours = 9;
const minutes = 5;
const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
console.log('Formatted time:', time); // '09:05'

console.log('\n=== 9. Repeat ===');

console.log('repeat(3):', 'Ha'.repeat(3)); // 'HaHaHa'
console.log('separator:', '-'.repeat(20));  // '--------------------'

console.log('\n=== 10. Chaining Methods ===');

const dirty = '  Hello, World!  ';
const clean = dirty
  .trim()
  .toLowerCase()
  .replace('hello', 'Hi')
  .replace('world', 'JavaScript');

console.log('Chained:', clean); // 'hi, javascript!'

console.log('\n=== 11. String to Number ===');

console.log('Number("42"):', Number('42'));          // 42
console.log('parseInt("42px"):', parseInt('42px'));  // 42
console.log('parseFloat("3.14"):', parseFloat('3.14')); // 3.14
console.log('+"42":', +'42');                        // 42

// Number conversion with different bases
console.log('parseInt("0xff", 16):', parseInt('0xff', 16)); // 255
console.log('parseInt("1010", 2):', parseInt('1010', 2));   // 10 (binary)

console.log('\n=== 12. String Comparison ===');

// Strings compared character by character (Unicode)
console.log('"a" < "b":', 'a' < 'b');   // true
console.log('"B" > "a":', 'B' > 'a');   // false! (uppercase < lowercase)
console.log('"Z" < "a":', 'Z' < 'a');   // true  (Z=90, a=97)

// Case-insensitive comparison
const s1 = 'Hello';
const s2 = 'HELLO';
console.log('Case insensitive equal:', s1.toLowerCase() === s2.toLowerCase()); // true

// localeCompare for proper sorting
const words = ['banana', 'Apple', 'cherry'];
const sorted = words.sort((a, b) => a.localeCompare(b));
console.log('Sorted:', sorted); // ['Apple', 'banana', 'cherry']

console.log('\n=== 13. Useful Patterns ===');

// Check if string is empty
const empty = '';
console.log('Is empty:', empty.length === 0);
console.log('Is blank:', '   '.trim().length === 0);

// Count occurrences
const target = 'the the the';
const occurrences = target.split('the').length - 1;
console.log('Occurrences of "the":', occurrences); // 3

// Reverse a string
const reversed = 'hello'.split('').reverse().join('');
console.log('Reversed:', reversed); // 'olleh'

// Check palindrome
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/\s/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

console.log('Is palindrome "racecar":', isPalindrome('racecar')); // true
console.log('Is palindrome "hello":', isPalindrome('hello'));     // false

console.log('\n=== Best Practices ===');
console.log('1. Use const for strings (prefer immutability)');
console.log('2. Use template literals for string interpolation');
console.log('3. Use slice() instead of substring() (supports negative)');
console.log('4. Use includes() instead of indexOf() >= 0');
console.log('5. Always trim() user input before processing');
console.log('6. Use localeCompare() for case-insensitive sorting');
console.log('7. Chain methods for cleaner code');
