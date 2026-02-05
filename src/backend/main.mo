import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Topic = Text;

  type QuizId = Nat;
  type TopicId = Nat;
  type QuestionId = Nat;

  type TopicData = {
    id : TopicId;
    name : Text;
  };

  type Quiz = {
    id : QuizId;
    title : Text;
    topicId : TopicId;
    questions : [QuestionData];
  };

  type QuestionData = {
    id : QuestionId;
    text : Text;
    options : [Text];
    correctAnswerIndex : Nat;
  };

  type Answer = Nat; // index of the selected option

  type Attempt = {
    user : Principal;
    quizId : QuizId;
    answers : [Answer];
    score : Nat;
  };

  public type UserProfile = {
    name : Text;
    role : Text; // "Teacher" or "Student"
  };

  // Internal state
  let topics = Map.empty<TopicId, TopicData>();
  let quizzes = Map.empty<QuizId, Quiz>();
  let attempts = Map.empty<Nat, Attempt>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var idCounter = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func nextId() : Nat {
    idCounter += 1;
    idCounter;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Topics
  public shared ({ caller }) func addTopic(name : Text) : async TopicId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins/teachers can add topics");
    };
    let id = nextId();
    topics.add(id, { id; name });
    id;
  };

  public query ({ caller }) func getTopic(id : TopicId) : async ?TopicData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view topics");
    };
    topics.get(id);
  };

  public query ({ caller }) func getAllTopics() : async [TopicData] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view topics");
    };
    topics.values().toArray();
  };

  // Quizzes
  public shared ({ caller }) func createQuiz(title : Text, topicId : TopicId) : async QuizId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins/teachers can create quizzes");
    };

    let id = nextId();
    let quiz = {
      id;
      title;
      topicId;
      questions = [];
    };
    quizzes.add(id, quiz);
    id;
  };

  public query ({ caller }) func getQuiz(id : QuizId) : async ?Quiz {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view quizzes");
    };
    quizzes.get(id);
  };

  public query ({ caller }) func getQuizzesByTopic(topicId : TopicId) : async [Quiz] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view quizzes");
    };
    quizzes.values().toArray().filter(func(quiz) { quiz.topicId == topicId });
  };

  // Questions
  public shared ({ caller }) func addQuestionToQuiz(
    quizId : QuizId,
    text : Text,
    options : [Text],
    correctAnswerIndex : Nat,
  ) : async QuestionId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins/teachers can add questions");
    };

    if (options.size() < 2) {
      Runtime.trap("Questions require at least 2 options");
    };

    let questionId = nextId();
    let question = {
      id = questionId;
      text;
      options;
      correctAnswerIndex;
    };

    switch (quizzes.get(quizId)) {
      case (null) { Runtime.trap("Quiz not found") };
      case (?quiz) {
        let updatedQuestions = quiz.questions.concat([question]);
        let updatedQuiz = { quiz with questions = updatedQuestions };
        quizzes.add(quizId, updatedQuiz);
        questionId;
      };
    };
  };

  // Attempts
  public shared ({ caller }) func submitAttempt(quizId : QuizId, answers : [Nat]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit quiz attempts");
    };

    switch (quizzes.get(quizId)) {
      case (null) { Runtime.trap("Quiz not found") };
      case (?quiz) {
        if (answers.size() != quiz.questions.size()) {
          Runtime.trap("Number of answers does not match number of questions");
        };

        var score = 0;
        for (i in quiz.questions.keys()) {
          if (answers[i] == quiz.questions[i].correctAnswerIndex) { score += 1 };
        };

        let attemptId = nextId();
        let attempt = {
          user = caller;
          quizId;
          answers;
          score;
        };

        attempts.add(attemptId, attempt);
        score;
      };
    };
  };

  public query ({ caller }) func getAttemptsByQuiz(quizId : QuizId) : async [Attempt] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins/teachers can view all quiz attempts");
    };
    attempts.values().toArray().filter(func(attempt) { attempt.quizId == quizId });
  };

  public query ({ caller }) func getCallerAttemptsByQuiz(quizId : QuizId) : async [Attempt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their own attempts");
    };
    attempts.values().toArray().filter(
      func(attempt) {
        attempt.quizId == quizId and attempt.user == caller
      }
    );
  };
};
