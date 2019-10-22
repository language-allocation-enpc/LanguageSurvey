import React, { Component } from "react";
import { CourseList, CourseRanking } from "./courseRankingTools";
import { ErrorMessage, QuestionFooter, QuestionInstructions } from "./utils";
class CourseRankingQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = { error_messages: [] };
  }

  setRanking = new_ranking => {
    let new_answers = this.props.getAnswers();
    new_answers[this.props.answer] = new_ranking;
    this.props.setAnswers(new_answers);
  };

  getRanking = () => {
    return this.props.getAnswers()[this.props.answer];
  };

  handleAddCourseToRanking = course => {
    if (!this.getRanking().includes(course)) {
      let new_ranking = this.getRanking();
      new_ranking.push(course);
      this.setRanking(new_ranking);
    }
  };

  handleRankUp = index_in_ranking => {
    //fait gagner une place dans le classement
    if (index_in_ranking > 0) {
      let new_ranking = this.getRanking();
      let course_to_move = this.getRanking()[index_in_ranking]; //swap
      new_ranking[index_in_ranking] = new_ranking[index_in_ranking - 1];
      new_ranking[index_in_ranking - 1] = course_to_move;
      this.setRanking(new_ranking);
    }
  };

  handleRankDown = index_in_ranking => {
    //fait perdre une place dans le classement
    if (index_in_ranking < this.getRanking().length - 1) {
      let new_ranking = this.getRanking();
      let course_to_move = this.getRanking()[index_in_ranking]; //swap
      new_ranking[index_in_ranking] = new_ranking[index_in_ranking + 1];
      new_ranking[index_in_ranking + 1] = course_to_move;
      this.setRanking(new_ranking);
    }
  };

  handleDeletionFromRanking = index_in_ranking => {
    let new_ranking = this.getRanking();
    new_ranking.splice(index_in_ranking, 1);
    this.setRanking(new_ranking);
  };

  verificationFunction = () => {
    let answers = this.props.getAnswers();
    let current_error_messages = [];
    let all_is_right = true;
    if (answers[this.props.answer].length === 0) {
      //classement vide affiche un message d'erreur
      current_error_messages.push(
        <ErrorMessage text="Attention ! Vous n'avez classé aucun cours ! Veuillez modifier le nombre de cours en début de questionnaire si vous ne souhaitez en suivre aucun dans cette catégorie." />
      );
      all_is_right = false;
    }
    this.setState({ error_messages: current_error_messages });
    return all_is_right;
  };

  render() {
    let instructions = this.props.instructions;
    if (this.state.error_messages.length > 0) {
      instructions = this.state.error_messages;
    }
    return (
      <div className="question">
        <QuestionInstructions text={instructions} />
        <div className="question-content">
          <CourseList
            courses={this.props.courses}
            handleAddCourseToRanking={this.handleAddCourseToRanking}
            getSchedules={this.props.getSchedules}
          />
          <CourseRanking
            ranking={this.getRanking()}
            handleRankUp={this.handleRankUp}
            handleRankDown={this.handleRankDown}
            handleDeletionFromRanking={this.handleDeletionFromRanking}
            getSchedules={this.props.getSchedules}
          />
        </div>
        <QuestionFooter
          handleStepChange={this.props.handleStepChange}
          getStepList={this.props.getStepList}
          getStepIndex={this.props.getStepIndex}
          verificationFunction={this.verificationFunction}
        />
      </div>
    );
  }
}

export default CourseRankingQuestion;
