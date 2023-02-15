pragma solidity ^0.8.0;

contract Roster {
  uint public studentCount = 0;

  struct Student {
    uint id;
    string content;
  }

  mapping(uint => Student) public students;

  event StudentCreated(
    uint id,
    string content
  );

  constructor() public {
    createStudent("Satoshi Nakamoto");
  }

  function createStudent(string memory _content) public {
    studentCount ++;
    students[studentCount] = Student(studentCount, _content);
    emit StudentCreated(studentCount, _content);
  }


}
