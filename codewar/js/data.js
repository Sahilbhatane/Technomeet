// CodeWar Competition Data - Embedded with obfuscated answers
// All answers are base64 encoded: A=QQ==, B=Qg==, C=Qw==, D=RA==

const CodeWarData = {
  mcq: {
    basic: [
      { id: 1, question: "Which symbol is used to end a statement in C, C++ and Java?", code: "", options: [":", ".", ";", ","], answer: "Qw==" },
      { id: 2, question: "Which of the following is a valid variable name?", code: "", options: ["2num", "num-1", "num_1", "int"], answer: "Qw==" },
      { id: 3, question: "Which data type is used to store whole numbers?", code: "", options: ["float", "char", "int", "double"], answer: "Qw==" },
      { id: 4, question: "Which operator is used for addition?", code: "", options: ["*", "/", "+", "%"], answer: "Qw==" },
      { id: 5, question: "Which loop executes at least once?", code: "", options: ["for", "while", "do-while", "if"], answer: "Qw==" },
      { id: 6, question: "Which keyword is used to take decision?", code: "", options: ["for", "if", "break", "continue"], answer: "Qg==" },
      { id: 7, question: "Which of the following is used to store multiple values of same type?", code: "", options: ["variable", "function", "array", "loop"], answer: "Qw==" },
      { id: 8, question: "What is the default value of int variable in Java?", code: "", options: ["0", "1", "null", "garbage"], answer: "QQ==" },
      { id: 9, question: "Which symbol is used for single-line comment?", code: "", options: ["/* */", "#", "//", ""], answer: "Qw==" },
      { id: 10, question: "Which function is used to print output in C?", code: "", options: ["cout", "print()", "printf()", "println"], answer: "Qw==" },
      { id: 11, question: "Which function is used to take input in Python?", code: "", options: ["scan()", "input()", "read()", "get()"], answer: "Qg==" },
      { id: 12, question: "Which of the following is a relational operator?", code: "", options: ["=", "+", "==", "&&"], answer: "Qw==" },
      { id: 13, question: "Which keyword is used to define a function in Python?", code: "", options: ["function", "define", "def", "fun"], answer: "Qw==" },
      { id: 14, question: "Which header file is required for input-output in C?", code: "", options: ["stdlib.h", "math.h", "stdio.h", "conio.h"], answer: "Qw==" },
      { id: 15, question: "Which access specifier is most restrictive in Java?", code: "", options: ["public", "protected", "default", "private"], answer: "RA==" },
      { id: 16, question: "Which keyword is used to stop a loop?", code: "", options: ["stop", "exit", "break", "end"], answer: "Qw==" },
      { id: 17, question: "Which data type is used to store characters?", code: "", options: ["int", "char", "string", "float"], answer: "Qg==" },
      { id: 18, question: "Which of the following is NOT a loop?", code: "", options: ["for", "while", "do-while", "switch"], answer: "RA==" },
      { id: 19, question: "Which operator is used to find remainder?", code: "", options: ["/", "%", "*", "+"], answer: "Qg==" },
      { id: 20, question: "Which keyword is used to create an object in Java?", code: "", options: ["class", "object", "new", "this"], answer: "Qw==" }
    ],
    c: [
      { id: 1, question: "What will be the output?", code: "int x = 5; printf(\"%d %d\", x, x, x);", options: ["5 5", "5 5 5", "5", "Compile error"], answer: "Qg==" },
      { id: 2, question: "What is the output?", code: "printf(\"%d\", printf(\"Code\"));", options: ["Code 4", "4 Code", "Code", "Undefined"], answer: "QQ==" },
      { id: 3, question: "Which statement is TRUE about this function?", code: "void fun() { static int x = 10; x++; }", options: ["x is initialized every call", "x retains value across calls", "Compile error", "x is global"], answer: "Qg==" },
      { id: 4, question: "What will sizeof return?", code: "char p[] = \"Code\"; printf(\"%d\", sizeof(p));", options: ["4", "5", "8", "sizeof(char*)"], answer: "Qg==" },
      { id: 5, question: "What is the correct syntax to print text in C?", code: "", options: ["print(\"Hello\")", "printf(\"Hello\")", "echo(\"Hello\")", "cout << \"Hello\""], answer: "Qg==" },
      { id: 6, question: "What is printed?", code: "int a = 5; printf(\"%d\", a++);", options: ["5", "6", "4", "Undefined"], answer: "QQ==" },
      { id: 7, question: "Output of the following code?", code: "char p[] = \"CodeWar\"; printf(\"%c\", p[4]);", options: ["W", "e", "o", "r"], answer: "Qg==" },
      { id: 8, question: "Which symbol is used to end a statement in C?", code: "", options: [";", ".", ",", ":"], answer: "QQ==" },
      { id: 9, question: "What will be the output?", code: "printf(\"%d\", 5 + 3 * 2);", options: ["16", "11", "10", "13"], answer: "Qg==" },
      { id: 10, question: "What will be the output?", code: "static int x; if(x) printf(\"Yes\"); else printf(\"No\");", options: ["Yes", "No", "0", "Garbage"], answer: "Qg==" },
      { id: 11, question: "Which header file is required for printf?", code: "", options: ["stdlib.h", "stdio.h", "conio.h", "string.h"], answer: "Qg==" },
      { id: 12, question: "Identify the correct statement about this pointer usage", code: "int const *p = x;", options: ["p points to constant int", "Constant pointer to int", "Both constant", "Compile error"], answer: "QQ==" },
      { id: 13, question: "What is the output?", code: "int x = 1; switch(x) { case 1: printf(\"1\"); break; case 2: printf(\"2\"); }", options: ["1", "12", "2", "Nothing"], answer: "QQ==" },
      { id: 14, question: "What is the default value of an uninitialized local variable?", code: "", options: ["0", "NULL", "Garbage value", "Depends on data type"], answer: "Qw==" },
      { id: 15, question: "Which option best describes the issue in this code?", code: "char p[5]; strcpy(p, \"Code\");", options: ["Buffer overflow", "No issue", "Null terminator missing", "Type mismatch"], answer: "Qg==" },
      { id: 16, question: "What is the behavior of this loop?", code: "int i = 0; while(i < 5) { i = i + 1; if(i == 3) printf(\"%d\", i); }", options: ["Prints 3", "Infinite loop", "Prints nothing", "Prints 1 2 3 4 5"], answer: "QQ==" },
      { id: 17, question: "What does this macro expand to?", code: "#define SQR(x) x*x; printf(\"%d\", SQR(2+1));", options: ["9", "6", "5", "Compile error"], answer: "Qg==" },
      { id: 18, question: "What will be printed?", code: "int arr[] = {10, 20, 30, 40}; printf(\"%d\", *arr + 2);", options: ["12", "20", "10", "30"], answer: "QQ==" },
      { id: 19, question: "What is the behavior of this program?", code: "int i = 0; for(printf(\"A\"); i < 2; printf(\"B\"), i++) {}", options: ["Prints ABAB", "Prints AABB", "Infinite A", "Compile error"], answer: "QQ==" },
      { id: 20, question: "What happens when this code executes?", code: "int a = 3; int b = sizeof(a++); printf(\"%d %d\", a, b);", options: ["3 4", "4 4", "3 2", "Undefined"], answer: "QQ==" }
    ],
    cpp: [
      { id: 1, question: "What is the output of the following code?", code: "int a = 5;\ncout << a++ << \" \" << ++a;", options: ["5 6", "5 7", "6 6", "6 7"], answer: "Qg==" },
      { id: 2, question: "Why is a destructor made virtual in a base class?", code: "", options: ["Faster execution", "Proper deletion of derived object", "Reduce memory usage", "Avoid syntax error"], answer: "Qg==" },
      { id: 3, question: "What will be the output?", code: "int a = 10;\nint &r = a;\nr = 20;\ncout << a;", options: ["10", "20", "Garbage", "Compilation error"], answer: "Qg==" },
      { id: 4, question: "Which of the following best describes object slicing?", code: "", options: ["Pointer mismatch", "Loss of derived class data", "Memory leak", "Runtime error"], answer: "Qg==" },
      { id: 5, question: "Output of the code?", code: "int x = 3;\ncout << sizeof(x++);", options: ["3", "4", "8", "Depends on compiler"], answer: "Qg==" },
      { id: 6, question: "What does nullptr ensure?", code: "", options: ["Faster execution", "Type-safe null pointer", "Zero memory", "Garbage value"], answer: "Qg==" },
      { id: 7, question: "What is the output?", code: "static int x = 0;\nx++;\ncout << x;", options: ["Always 1", "Always 0", "Increments each call", "Compilation error"], answer: "Qw==" },
      { id: 8, question: "Which function cannot be virtual?", code: "", options: ["Destructor", "Constructor", "Member function", "Inline function"], answer: "Qg==" },
      { id: 9, question: "What happens if delete is not used for dynamically allocated memory?", code: "", options: ["Compile error", "Runtime error", "Memory leak", "Program stops"], answer: "Qw==" },
      { id: 10, question: "Output of the program?", code: "int a = 5;\nint *p = &a;\n*p = 10;\ncout << a;", options: ["5", "10", "Garbage", "Error"], answer: "Qg==" },
      { id: 11, question: "Why is vector faster than list for random access?", code: "", options: ["Uses stack", "Contiguous memory", "Uses pointers", "Uses recursion"], answer: "Qg==" },
      { id: 12, question: "What is the use of mutable keyword?", code: "", options: ["Change class design", "Modify data in const function", "Avoid constructor", "Speed improvement"], answer: "Qg==" },
      { id: 13, question: "What will be the output?", code: "int a = 10;\nconst int *p = &a;\na = 20;\ncout << *p;", options: ["10", "20", "Error", "Undefined"], answer: "Qg==" },
      { id: 14, question: "Which supports runtime polymorphism?", code: "", options: ["Overloading", "Templates", "Virtual functions", "Inline"], answer: "Qw==" },
      { id: 15, question: "Output of the code?", code: "int arr[5];\ncout << sizeof(arr)/sizeof(arr[0]);", options: ["4", "5", "8", "Depends"], answer: "Qg==" },
      { id: 16, question: "What is dangling pointer?", code: "", options: ["Null pointer", "Pointer to constant", "Pointer to deallocated memory", "Wild pointer"], answer: "Qw==" },
      { id: 17, question: "What happens when delete[] is replaced by delete?", code: "", options: ["Safe", "Only memory leak", "Undefined behavior", "No effect"], answer: "Qw==" },
      { id: 18, question: "What will be output?", code: "int a = 5;\nint b = a;\nb = 10;\ncout << a;", options: ["5", "10", "Garbage", "Error"], answer: "QQ==" },
      { id: 19, question: "Why explicit constructor is used?", code: "", options: ["Speed", "Avoid implicit conversion", "Inheritance", "Polymorphism"], answer: "Qg==" },
      { id: 20, question: "What is Rule of Zero?", code: "", options: ["No constructors", "No pointers", "Compiler manages resources", "No class"], answer: "Qw==" }
    ],
    java: [
      { id: 1, question: "Which method is the starting point of a Java program?", code: "", options: ["start()", "main()", "run()", "init()"], answer: "Qg==" },
      { id: 2, question: "Which keyword is used to inherit a class?", code: "", options: ["implements", "inherit", "extends", "super"], answer: "Qw==" },
      { id: 3, question: "Which of these is a checked exception?", code: "", options: ["ArithmeticException", "NullPointerException", "IOException", "ArrayIndexOutOfBoundsException"], answer: "Qw==" },
      { id: 4, question: "Which of the following cannot be declared static?", code: "", options: ["Variable", "Method", "Constructor", "Block"], answer: "Qw==" },
      { id: 5, question: "Which collection does NOT allow duplicate elements?", code: "", options: ["ArrayList", "Vector", "HashSet", "LinkedList"], answer: "Qw==" },
      { id: 6, question: "Which keyword prevents method overriding?", code: "", options: ["static", "private", "final", "protected"], answer: "Qw==" },
      { id: 7, question: "Which of the following is immutable?", code: "", options: ["ArrayList", "String", "StringBuilder", "StringBuffer"], answer: "Qg==" },
      { id: 8, question: "Which access modifier allows access only within the same package?", code: "", options: ["private", "protected", "default", "public"], answer: "Qw==" },
      { id: 9, question: "What will be the output? (Logic)", code: "int a = 5;\nSystem.out.println(a++ + ++a);", options: ["10", "11", "12", "13"], answer: "Qw==" },
      { id: 10, question: "Which memory area stores objects in Java?", code: "", options: ["Stack", "Heap", "Method area", "CPU register"], answer: "Qg==" },
      { id: 11, question: "What will be the output? (Logic)", code: "int i = 1;\nwhile(i <= 3) {\n    System.out.print(i++);\n}", options: ["123", "012", "Infinite loop", "321"], answer: "QQ==" },
      { id: 12, question: "What will be the output? (Logic)", code: "System.out.println(5 / 2);", options: ["2.5", "2", "3", "Compile-time error"], answer: "Qg==" },
      { id: 13, question: "What will be the output? (Logic)", code: "int x = 10;\nif(x++ > 10)\n    System.out.print(\"A\");\nelse\n    System.out.print(\"B\");", options: ["A", "B", "AB", "Compile-time error"], answer: "Qg==" },
      { id: 14, question: "Which feature supports runtime polymorphism?", code: "", options: ["Method overloading", "Method overriding", "Encapsulation", "Abstraction"], answer: "Qg==" },
      { id: 15, question: "What will be the output? (Logic)", code: "int a = 10;\nint b = 20;\nSystem.out.println(a & b);", options: ["0", "20", "30", "10"], answer: "QQ==" },
      { id: 16, question: "Which of the following allows multiple inheritance in Java?", code: "", options: ["Class", "Abstract class", "Interface", "Package"], answer: "Qw==" },
      { id: 17, question: "What will be the output? (Logic)", code: "int x = 0;\nfor(; x < 3; x++);\nSystem.out.print(x);", options: ["0", "2", "3", "Compile-time error"], answer: "Qw==" },
      { id: 18, question: "Which exception occurs when dividing by zero?", code: "", options: ["IOException", "NullPointerException", "ArithmeticException", "NumberFormatException"], answer: "Qw==" },
      { id: 19, question: "Which keyword refers to the current object?", code: "", options: ["self", "this", "super", "current"], answer: "Qg==" },
      { id: 20, question: "What will be the output?", code: "int x = 5;\nSystem.out.println(x++ + x++ + ++x);", options: ["17", "18", "19", "20"], answer: "Qw==" }
    ],
    python: [
      { id: 1, question: "Which data type is immutable?", code: "", options: ["List", "Set", "Dictionary", "Tuple"], answer: "RA==" },
      { id: 2, question: "Which loop is best when number of iterations is known?", code: "", options: ["while", "for", "do-while", "infinite"], answer: "Qg==" },
      { id: 3, question: "Which of the following is NOT a Python keyword?", code: "", options: ["pass", "eval", "lambda", "break"], answer: "Qg==" },
      { id: 4, question: "What does append() do?", code: "", options: ["Adds element at beginning", "Adds element at end", "Removes element", "Sorts list"], answer: "Qg==" },
      { id: 5, question: "Which operator checks equality?", code: "", options: ["=", "==", "!=", ":="], answer: "Qg==" },
      { id: 6, question: "Which collection does NOT allow duplicate values?", code: "", options: ["List", "Tuple", "Set", "String"], answer: "Qw==" },
      { id: 7, question: "What is the output?", code: "x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)", options: ["[1, 2, 3]", "[4]", "[1, 2, 3, 4]", "Error"], answer: "Qw==" },
      { id: 8, question: "What does this return?", code: "def test():\n    return\nprint(test())", options: ["0", "False", "None", "Error"], answer: "Qw==" },
      { id: 9, question: "What will be printed?", code: "X = \"Python\"\nprint(x[10:])", options: ["Error", "Python", "Empty string", "None"], answer: "Qw==" },
      { id: 10, question: "What happens here?", code: "a = {1, 2, 3}\na.add(3)\nprint(len(a))", options: ["2", "3", "4", "Error"], answer: "Qg==" },
      { id: 11, question: "Output?", code: "print([i for i in range(3)])", options: ["[1, 2, 3]", "[0, 1, 2]", "[0, 1, 2, 3]", "Error"], answer: "Qg==" },
      { id: 12, question: "Output?", code: "X = 10\ndef fun():\n    global x\n    X = x + 5\nfun()\nprint(x)", options: ["10", "5", "15", "Error"], answer: "Qw==" },
      { id: 13, question: "What does pop() do?", code: "", options: ["Adds element", "Removes last element", "Sorts list", "Copies list"], answer: "Qg==" },
      { id: 14, question: "Which keyword is used to handle exceptions?", code: "", options: ["error", "try", "handle", "catch"], answer: "Qg==" },
      { id: 15, question: "Which operator is used for exponentiation?", code: "", options: ["^", "**", "//", "%"], answer: "Qg==" },
      { id: 16, question: "What does the continue statement do in a loop?", code: "", options: ["Terminates the loop completely", "Skips the current iteration and moves to the next iteration", "Exits the program", "Pauses the loop execution"], answer: "Qg==" },
      { id: 17, question: "Output?", code: "print(\"Python\"[1:4])", options: ["Pyt", "yth", "tho", "hon"], answer: "Qg==" },
      { id: 18, question: "Output of the code?", code: "def add(a, b=2, c=3):\n    return a + b + c\nprint(add(1, c=5))", options: ["6", "8", "Error", "10"], answer: "Qg==" },
      { id: 19, question: "Output of the code", code: "print(\"5\" + \"5\")", options: ["10", "55", "Error", "None"], answer: "Qg==" },
      { id: 20, question: "What is the output?", code: "print(type(lambda x: x))", options: ["function", "method", "lambda", "<class 'function'>"], answer: "RA==" }
    ]
  },
  debug: {
    c: [
      {
        id: 1,
        language: "c",
        faultyCode: `#include <stdio.h>
int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1, c;
    for (int i = 2; i <= n; i--) {  // Bug: should be i++
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}
int main() {
    printf("%d", fibonacci(5));
    return 0;
}`,
        correctCode: `#include <stdio.h>
int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1, c;
    for (int i = 2; i <= n; i++) {  // Fixed: i++
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}
int main() {
    printf("%d", fibonacci(5));
    return 0;
}`,
        explanation: "The loop increment was incorrect (i-- instead of i++), causing infinite loop or wrong output"
      },
      {
        id: 2,
        language: "c",
        faultyCode: `#include <stdio.h>
int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int i = 0; i <= 5; i++) {  // Bug: should be i < 5
        sum += arr[i];
    }
    printf("%d", sum);
    return 0;
}`,
        correctCode: `#include <stdio.h>
int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int i = 0; i < 5; i++) {  // Fixed: i < 5
        sum += arr[i];
    }
    printf("%d", sum);
    return 0;
}`,
        explanation: "Array index out of bounds: loop condition should be i < 5, not i <= 5"
      },
      {
        id: 3,
        language: "c",
        faultyCode: `#include <stdio.h>
int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}
int main() {
    printf("%d", factorial(5));
    return 0;
}`,
        correctCode: `#include <stdio.h>
int factorial(int n) {
    if (n == 0 || n == 1) return 1;  // Fixed: added n == 1 check
    return n * factorial(n - 1);
}
int main() {
    printf("%d", factorial(5));
    return 0;
}`,
        explanation: "Missing base case for n == 1, though it works, adding explicit check is better practice"
      },
      {
        id: 4,
        language: "c",
        faultyCode: `int main() {
    int x = 10;
    if (x = 5) {  // Bug: should be x == 5
        printf("x is 5");
    } else {
        printf("x is not 5");
    }
    return 0;
}`,
        correctCode: `#include <stdio.h>
int main() {
    int x = 10;
    if (x == 5) {  // Fixed: x == 5
        printf("x is 5");
    } else {
        printf("x is not 5");
    }
    return 0;
}`,
        explanation: "Assignment operator (=) used instead of equality operator (==) in condition"
      },
      {
        id: 5,
        language: "c",
        faultyCode: `#include <stdio.h>
int main() {
    char str[10];
    strcpy(str, "Hello World");  // Bug: string too long for array
    printf("%s", str);
    return 0;
}`,
        correctCode: `#include <stdio.h>
#include <string.h>
int main() {
    char str[20];  // Fixed: increased array size
    strcpy(str, "Hello World");
    printf("%s", str);
    return 0;
}`,
        explanation: "Buffer overflow: array size too small for the string being copied"
      }
    ],
    cpp: [
      {
        id: 1,
        language: "cpp",
        faultyCode: `#include <iostream>
using namespace std;
class Base {
public:
    void display() {
        cout << "Base" << endl;
    }
};
class Derived : public Base {
public:
    void display() {
        cout << "Derived" << endl;
    }
};
int main() {
    Base* ptr = new Derived();
    ptr->display();  // Bug: should use virtual function
    return 0;
}`,
        correctCode: `#include <iostream>
using namespace std;
class Base {
public:
    virtual void display() {  // Fixed: added virtual
        cout << "Base" << endl;
    }
};
class Derived : public Base {
public:
    void display() {
        cout << "Derived" << endl;
    }
};
int main() {
    Base* ptr = new Derived();
    ptr->display();
    return 0;
}`,
        explanation: "Missing virtual keyword prevents runtime polymorphism"
      },
      {
        id: 2,
        language: "cpp",
        faultyCode: `#include <iostream>
using namespace std;
int main() {
    int* arr = new int[5];
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 2;
    }
    delete arr;  // Bug: should be delete[]
    return 0;
}`,
        correctCode: `#include <iostream>
using namespace std;
int main() {
    int* arr = new int[5];
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 2;
    }
    delete[] arr;  // Fixed: delete[] for arrays
    return 0;
}`,
        explanation: "Using delete instead of delete[] for dynamically allocated arrays causes undefined behavior"
      },
      {
        id: 3,
        language: "cpp",
        faultyCode: `#include <iostream>
using namespace std;
int main() {
    int x = 5;
    int& ref = x;
    ref = 10;
    int& ref2;  // Bug: reference must be initialized
    cout << x << endl;
    return 0;
}`,
        correctCode: `#include <iostream>
using namespace std;
int main() {
    int x = 5;
    int& ref = x;
    ref = 10;
    int y = 20;
    int& ref2 = y;  // Fixed: reference initialized
    cout << x << endl;
    return 0;
}`,
        explanation: "References must be initialized when declared"
      },
      {
        id: 4,
        language: "cpp",
        faultyCode: `#include <iostream>
using namespace std;
class Test {
    int value;
public:
    Test(int v) : value(v) {}
    void setValue(int v) const {  // Bug: const function modifying member
        value = v;
    }
};
int main() {
    Test t(5);
    t.setValue(10);
    return 0;
}`,
        correctCode: `#include <iostream>
using namespace std;
class Test {
    mutable int value;  // Fixed: mutable keyword
public:
    Test(int v) : value(v) {}
    void setValue(int v) const {
        value = v;
    }
};
int main() {
    Test t(5);
    t.setValue(10);
    return 0;
}`,
        explanation: "Cannot modify non-mutable member in const function"
      },
      {
        id: 5,
        language: "cpp",
        faultyCode: `#include <iostream>
using namespace std;
int main() {
    int* ptr = nullptr;
    *ptr = 10;  // Bug: dereferencing null pointer
    cout << *ptr << endl;
    return 0;
}`,
        correctCode: `#include <iostream>
using namespace std;
int main() {
    int* ptr = new int;  // Fixed: allocate memory
    *ptr = 10;
    cout << *ptr << endl;
    delete ptr;
    return 0;
}`,
        explanation: "Dereferencing null pointer causes undefined behavior"
      }
    ],
    java: [
      {
        id: 1,
        language: "java",
        faultyCode: `public class Test {
    public static void main(String[] args) {
        int[] arr = new int[5];
        for (int i = 0; i <= 5; i++) {  // Bug: should be i < 5
            arr[i] = i;
        }
    }
}`,
        correctCode: `public class Test {
    public static void main(String[] args) {
        int[] arr = new int[5];
        for (int i = 0; i < 5; i++) {  // Fixed: i < 5
            arr[i] = i;
        }
    }
}`,
        explanation: "ArrayIndexOutOfBoundsException: loop condition should be i < 5"
      },
      {
        id: 2,
        language: "java",
        faultyCode: `public class Test {
    public static void main(String[] args) {
        String str = null;
        int length = str.length();  // Bug: NullPointerException
        System.out.println(length);
    }
}`,
        correctCode: `public class Test {
    public static void main(String[] args) {
        String str = "Hello";
        int length = str.length();  // Fixed: initialize string
        System.out.println(length);
    }
}`,
        explanation: "NullPointerException: calling method on null reference"
      },
      {
        id: 3,
        language: "java",
        faultyCode: `public class Test {
    private int value;
    public void setValue(int v) {
        value = v;
    }
    public static void main(String[] args) {
        setValue(10);  // Bug: cannot call non-static from static
    }
}`,
        correctCode: `public class Test {
    private int value;
    public void setValue(int v) {
        value = v;
    }
    public static void main(String[] args) {
        Test t = new Test();  // Fixed: create instance
        t.setValue(10);
    }
}`,
        explanation: "Cannot call non-static method from static context"
      },
      {
        id: 4,
        language: "java",
        faultyCode: `public class Test {
    public static void main(String[] args) {
        int x = 10;
        if (x = 5) {  // Bug: should be x == 5
            System.out.println("x is 5");
        }
    }
}`,
        correctCode: `public class Test {
    public static void main(String[] args) {
        int x = 10;
        if (x == 5) {  // Fixed: x == 5
            System.out.println("x is 5");
        }
    }
}`,
        explanation: "Assignment operator used instead of equality operator (Java doesn't allow this, but similar logic error)"
      },
      {
        id: 5,
        language: "java",
        faultyCode: `public class Test {
    public static void main(String[] args) {
        int result = 10 / 0;  // Bug: division by zero
        System.out.println(result);
    }
}`,
        correctCode: `public class Test {
    public static void main(String[] args) {
        int divisor = 2;
        if (divisor != 0) {  // Fixed: check before division
            int result = 10 / divisor;
            System.out.println(result);
        }
    }
}`,
        explanation: "ArithmeticException: division by zero"
      }
    ],
    python: [
      {
        id: 1,
        language: "python",
        faultyCode: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

def main():
    result = factorial(-1)  # Bug: negative number
    print(result)

main()`,
        correctCode: `def factorial(n):
    if n < 0:  # Fixed: handle negative
        return None
    if n == 0:
        return 1
    return n * factorial(n - 1)

def main():
    result = factorial(-1)
    print(result)

main()`,
        explanation: "Missing check for negative numbers causes infinite recursion"
      },
      {
        id: 2,
        language: "python",
        faultyCode: `def divide_numbers(a, b):
    return a / b  # Bug: no check for zero

result = divide_numbers(10, 0)
print(result)`,
        correctCode: `def divide_numbers(a, b):
    if b == 0:  # Fixed: check for zero
        return None
    return a / b

result = divide_numbers(10, 0)
print(result)`,
        explanation: "ZeroDivisionError: division by zero not handled"
      },
      {
        id: 3,
        language: "python",
        faultyCode: `def get_element(lst, index):
    return lst[index]  # Bug: no bounds check

my_list = [1, 2, 3]
result = get_element(my_list, 5)
print(result)`,
        correctCode: `def get_element(lst, index):
    if index < 0 or index >= len(lst):  # Fixed: bounds check
        return None
    return lst[index]

my_list = [1, 2, 3]
result = get_element(my_list, 5)
print(result)`,
        explanation: "IndexError: list index out of range"
      },
      {
        id: 4,
        language: "python",
        faultyCode: `def process_data(data):
    total = 0
    for item in data:
        total += item['value']  # Bug: KeyError if 'value' missing
    return total

data = [{'value': 10}, {'value': 20}, {}]
result = process_data(data)
print(result)`,
        correctCode: `def process_data(data):
    total = 0
    for item in data:
        if 'value' in item:  # Fixed: check key exists
            total += item['value']
    return total

data = [{'value': 10}, {'value': 20}, {}]
result = process_data(data)
print(result)`,
        explanation: "KeyError: accessing dictionary key that doesn't exist"
      },
      {
        id: 5,
        language: "python",
        faultyCode: `def calculate_average(numbers):
    total = sum(numbers)
    count = len(numbers)
    return total / count  # Bug: division by zero if empty list

result = calculate_average([])
print(result)`,
        correctCode: `def calculate_average(numbers):
    if len(numbers) == 0:  # Fixed: check empty list
        return 0
    total = sum(numbers)
    count = len(numbers)
    return total / count

result = calculate_average([])
print(result)`,
        explanation: "ZeroDivisionError: dividing by zero when list is empty"
      }
    ]
  },
  ps: [
    {
      id: 1,
      title: "Sum of Two Numbers",
      description: "Write a function that takes two numbers as input and returns their sum.\n\nInput: Two integers a and b\nOutput: Return a + b\n\nExample:\nInput: a = 5, b = 3\nOutput: 8",
      constraints: "1 <= a, b <= 1000",
      testCases: {
        c: [
          { input: "5 3", output: "8" },
          { input: "10 20", output: "30" },
          { input: "100 200", output: "300" },
          { input: "1 1", output: "2" },
          { input: "999 1", output: "1000" }
        ],
        cpp: [
          { input: "5 3", output: "8" },
          { input: "10 20", output: "30" },
          { input: "100 200", output: "300" },
          { input: "1 1", output: "2" },
          { input: "999 1", output: "1000" }
        ],
        java: [
          { input: "5 3", output: "8" },
          { input: "10 20", output: "30" },
          { input: "100 200", output: "300" },
          { input: "1 1", output: "2" },
          { input: "999 1", output: "1000" }
        ],
        python: [
          { input: "5 3", output: "8" },
          { input: "10 20", output: "30" },
          { input: "100 200", output: "300" },
          { input: "1 1", output: "2" },
          { input: "999 1", output: "1000" }
        ]
      }
    },
    {
      id: 2,
      title: "Star Pattern",
      description: "Print a right-angled triangle pattern of stars.\n\nInput: An integer n representing the number of rows\nOutput: Print n lines, where line i contains i stars\n\nExample:\nInput: 5\nOutput:\n*\n**\n***\n****\n*****",
      constraints: "1 <= n <= 20",
      testCases: {
        c: [
          { input: "5", output: "*\n**\n***\n****\n*****" },
          { input: "3", output: "*\n**\n***" },
          { input: "1", output: "*" },
          { input: "4", output: "*\n**\n***\n****" }
        ],
        cpp: [
          { input: "5", output: "*\n**\n***\n****\n*****" },
          { input: "3", output: "*\n**\n***" },
          { input: "1", output: "*" },
          { input: "4", output: "*\n**\n***\n****" }
        ],
        java: [
          { input: "5", output: "*\n**\n***\n****\n*****" },
          { input: "3", output: "*\n**\n***" },
          { input: "1", output: "*" },
          { input: "4", output: "*\n**\n***\n****" }
        ],
        python: [
          { input: "5", output: "*\n**\n***\n****\n*****" },
          { input: "3", output: "*\n**\n***" },
          { input: "1", output: "*" },
          { input: "4", output: "*\n**\n***\n****" }
        ]
      }
    },
    {
      id: 3,
      title: "Find Maximum",
      description: "Write a function to find the maximum of three numbers.\n\nInput: Three integers a, b, c\nOutput: Return the maximum of the three numbers\n\nExample:\nInput: a = 5, b = 10, c = 3\nOutput: 10",
      constraints: "-1000 <= a, b, c <= 1000",
      testCases: {
        c: [
          { input: "5 10 3", output: "10" },
          { input: "1 2 3", output: "3" },
          { input: "10 5 8", output: "10" },
          { input: "-5 -10 -3", output: "-3" },
          { input: "0 0 0", output: "0" }
        ],
        cpp: [
          { input: "5 10 3", output: "10" },
          { input: "1 2 3", output: "3" },
          { input: "10 5 8", output: "10" },
          { input: "-5 -10 -3", output: "-3" },
          { input: "0 0 0", output: "0" }
        ],
        java: [
          { input: "5 10 3", output: "10" },
          { input: "1 2 3", output: "3" },
          { input: "10 5 8", output: "10" },
          { input: "-5 -10 -3", output: "-3" },
          { input: "0 0 0", output: "0" }
        ],
        python: [
          { input: "5 10 3", output: "10" },
          { input: "1 2 3", output: "3" },
          { input: "10 5 8", output: "10" },
          { input: "-5 -10 -3", output: "-3" },
          { input: "0 0 0", output: "0" }
        ]
      }
    },
    {
      id: 4,
      title: "Factorial",
      description: "Write a function to calculate the factorial of a number.\n\nInput: An integer n\nOutput: Return n! (factorial of n)\n\nExample:\nInput: 5\nOutput: 120\n\nNote: 0! = 1",
      constraints: "0 <= n <= 10",
      testCases: {
        c: [
          { input: "5", output: "120" },
          { input: "0", output: "1" },
          { input: "1", output: "1" },
          { input: "3", output: "6" },
          { input: "4", output: "24" }
        ],
        cpp: [
          { input: "5", output: "120" },
          { input: "0", output: "1" },
          { input: "1", output: "1" },
          { input: "3", output: "6" },
          { input: "4", output: "24" }
        ],
        java: [
          { input: "5", output: "120" },
          { input: "0", output: "1" },
          { input: "1", output: "1" },
          { input: "3", output: "6" },
          { input: "4", output: "24" }
        ],
        python: [
          { input: "5", output: "120" },
          { input: "0", output: "1" },
          { input: "1", output: "1" },
          { input: "3", output: "6" },
          { input: "4", output: "24" }
        ]
      }
    },
    {
      id: 5,
      title: "Check Even or Odd",
      description: "Write a function that checks if a number is even or odd.\n\nInput: An integer n\nOutput: Return \"Even\" if n is even, \"Odd\" if n is odd\n\nExample:\nInput: 5\nOutput: Odd\n\nInput: 4\nOutput: Even",
      constraints: "-1000 <= n <= 1000",
      testCases: {
        c: [
          { input: "5", output: "Odd" },
          { input: "4", output: "Even" },
          { input: "0", output: "Even" },
          { input: "-3", output: "Odd" },
          { input: "100", output: "Even" }
        ],
        cpp: [
          { input: "5", output: "Odd" },
          { input: "4", output: "Even" },
          { input: "0", output: "Even" },
          { input: "-3", output: "Odd" },
          { input: "100", output: "Even" }
        ],
        java: [
          { input: "5", output: "Odd" },
          { input: "4", output: "Even" },
          { input: "0", output: "Even" },
          { input: "-3", output: "Odd" },
          { input: "100", output: "Even" }
        ],
        python: [
          { input: "5", output: "Odd" },
          { input: "4", output: "Even" },
          { input: "0", output: "Even" },
          { input: "-3", output: "Odd" },
          { input: "100", output: "Even" }
        ]
      }
    }
  ]
};
