import React, { Component } from 'react';
import error_panel from 'images/error_panel.png';
import { Button, Card } from '@material-ui/core';

class QuestionInstructions extends Component {
    render() {
      return (
        <h2 className="question-instructions"> {this.props.text}</h2>
      );
    }
  }

class QuestionFooter extends Component {

    render() {
      let current_step_index=this.props.getStepIndex();
      let step_list_length=this.props.getStepList().length;
      let left_button=null;
      let right_button=null;
      if(current_step_index>0){
        left_button=<ChangeStepButton text="Précédent" onClick={()=>this.props.handleStepChange("previous")}/>
      }
      let nextButtonEffect=()=>{this.props.handleStepChange("next")}
      if(this.props.verificationFunction){//s'il y a une vérification à faire, elle est faite avant de passer à la question suivante
        nextButtonEffect=()=>{
          if(this.props.verificationFunction())
          {
            this.props.handleStepChange("next");
          }
        }
      }
      if(current_step_index<step_list_length-1){
        right_button=<ChangeStepButton text="Suivant" onClick={nextButtonEffect }/>
      }
      return (
        <div className="question-footer"> <div className="question-footer-left"> {left_button}</div><div className="question-footer-right">{right_button}</div></div>
      );
    }
  }


class CourseBox extends Component {
    render() {
      let schedules=this.props.getSchedules();
      let current_course_schedules_list=this.props.course.creneaux.map(schedule_index => <p key={schedule_index}>{schedules[schedule_index].day+(schedules[schedule_index].day==="hors-créneaux"?"":(" "+schedules[schedule_index].begin+"-"+schedules[schedule_index].end))}</p>)
      return (
        <Card className="course-box"> <div><h2>{this.props.course.name}</h2> <h3>{this.props.course.language}</h3>{current_course_schedules_list}</div> <div className="course-box-buttons">{this.props.buttons}</div></Card>
      );
    }
  }




class ChangeStepButton extends Component {
  render() {
    return (
      <Button className="change-step-button" onClick={this.props.onClick}>{this.props.text}</Button>
    );
  }
}

class FinalButton extends Component {
    render() {
      return (
        <Button className="final-button" onClick={this.props.onClick}>{this.props.text}</Button>
      );
    }
  }


class ErrorMessage extends Component {
  render() {
    return (
      <div className="error-message" ><img src={error_panel} alt="error_panel" style={{height: "5vh"}}/>{this.props.text}</div>
    );
  }
}

class WarningMessage extends Component {
  render() {
    return (
      <div className="warning-message" >{this.props.text}</div>
    );
  }
}

class CourseBoxList extends Component {
  render() {
    return (
      this.props.content.length===0 ?
      <div className="course-box-list-empty-text" >{this.props.emptyText}</div>:
      <div className="course-box-list" >{this.props.content}</div>
    );
  }
}

export {CourseBox,
  ChangeStepButton,
  FinalButton,
  ErrorMessage,
  WarningMessage,
  CourseBoxList,
  QuestionInstructions,
  QuestionFooter};
