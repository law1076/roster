pragma solidity ^0.8.0;

contract Roster {
  uint public studentCount = 0;

  struct Student {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Student) public students;

  event StudentCreated(
    uint id,
    string content,
    bool completed
  );

  event StudentCompleted(
    uint id,
    bool completed
  );

  constructor() public {
    createStudent("Satoshi Nakamoto");
  }

  function createStudent(string memory _content) public {
    studentCount ++;
    students[studentCount] = Student(studentCount, _content, false);
    emit StudentCreated(studentCount, _content, false);
  }

  function toggleCompleted(uint _id) public {
    Student memory _student = students[_id];
    _student.completed = !_student.completed;
    students[_id] = _student;
    emit StudentCompleted(_id, _student.completed);
  }

}