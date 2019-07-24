import React, { Component } from 'react';
import axios from 'axios';
import url from "../url";
import { CourseBox, Button, ChangeStepButton, FinalButton, ErrorMessage, WarningMessage
, CourseBoxList,  QuestionInstructions, QuestionFooter } from './components/utils'
import CourseRankingInstructions from './components/courseRankingInstructions'
import CourseRankingQuestion from './components/courseRankingQuestion'
import vowGenerator from "./VowGenerator";
import InitialQuestions from"./components/initialQuestions"
import error_panel from 'images/error_panel.png';
import './Questionnaire.css';



class Questionnaire extends Component {
    constructor(props) {
        super(props);
        this.state = { data: {courses: [], schedules: [], token: window.sessionStorage.getItem("token"), user_name: window.sessionStorage.getItem("name"), user_email: window.sessionStorage.getItem("email"), vows: window.sessionStorage.getItem("vows")}, is_loaded: false, step_list: ["initial_questions"], step_index: 0, answers_are_sent: false, answers: { year: '', TOEIC: '', justification_no_english: '', justification_no_english_text: '', number_english_courses: 1, number_other_courses: 0, english_courses_ranking:[], other_courses_ranking:[]}};

      }


    componentDidMount(){



      axios.get(url+"courses/", {withCredentials:false})
      .then(
        (result) => {
          let newState = Object.assign({}, this.state);
          newState.data.courses = result.data.result;
          newState.is_loaded = true;
          this.setState(
          newState
        );
        },
        (error) => {
          console.log("fail")
          this.setState({
            is_loaded: false
          });
        }
      );
      axios.get(url+"creneaux/", {withCredentials:false})
      .then(
        (result) => {
          let newState = Object.assign({}, this.state);
          newState.data.schedules = result.data.result;
          newState.is_loaded = true;
          this.setState(newState);
        },
        (error) => {
          this.setState({
            is_loaded: false
          });
        }
      );
    }


    buildStepList=(answers)=>{
      let step_list=["initial_questions"];
      if(answers.number_english_courses>0 || answers.number_other_courses>0){
        step_list.push("course_ranking_instructions");
      }
      if(answers.number_english_courses>0){
        step_list.push("ranking_english_courses");
      }
      if(answers.number_other_courses>0){
        step_list.push("ranking_other_courses");
      }
      step_list.push("final_question")
      return step_list
    }

    buildAvailableCourses=(answers, data)=>{
      let available_courses=data.courses;
      if(answers.year==='1A'){
        available_courses=available_courses
        .filter(
          (course)=>{
            let available_for_1A=true;
            for(let i=0; i<course.creneaux.length; i++){
              available_for_1A=available_for_1A&& data.schedules[course.creneaux[i]].type.split(', ').includes('1A');
            }
            return available_for_1A;
          }
          )
      } else if(answers.year==='2A/3A'){
        let available_courses=available_courses
        .filter(
          (course)=>{
            let available_for_2A3A=true;
            for(let i=0; i<course.creneaux.length; i++){
              available_for_2A3A=available_for_2A3A&& (data.schedules[course.creneaux[i]].type.split(', ').includes('2A')||data.schedules[course.creneaux[i]].type.split(', ').includes('3A'));
            }
            return available_for_2A3A;
          }
          )
      }
      return available_courses;
    }

    getStepIndex=()=>{return this.state.step_index;}

    getUserName=()=>{return this.state.data.user_name;}

    handleStepChange = (direction) => {
      if(direction==="previous"&&this.state.step_index>0){
        this.setState({step_index: this.state.step_index-1});
      } else if(direction==="next"&&this.state.step_index<this.state.step_list.length-1){
        if(this.state.step_index+1===this.state.step_list.length-1){ //vows computed when going to the last page
          this.updateVows()
        }
        this.setState({step_index: this.state.step_index+1});
      }
    }

    getStepList=()=>{return this.state.step_list;}

    setStepList=(new_step_list)=>{this.setState({step_list: new_step_list});}

    getAnswers=()=>{ return this.state.answers;}

    setAnswers=(new_answers)=>{
      let new_step_list=this.buildStepList(new_answers);
      this.setState({answers: new_answers, step_list: new_step_list});
    }

    updateVows=()=>{
      let answers=this.state.answers;
      let user_vows=vowGenerator(answers.number_english_courses, answers.number_other_courses, answers.english_courses_ranking, answers.other_courses_ranking, this.state.data.schedules);
      let new_state=this.state;
      new_state.data.user_vows=user_vows;
      this.setState(new_state);
    }

    enoughVows=()=>{
      return this.state.data.user_vows.length>5; //!!!!!!!!!!!!!!!!!!!!!à modifier
    }

    getAnswersAreSent=()=>{
        return this.state.answers_are_sent;
    }

    sendAnswers=()=>{
      axios.post(url+"users/students/vows/"+this.state.data.token, {vows:this.state.data.user_vows}, {withCredentials:false})
      .then(
        (result) => {
          this.setState({answers_are_sent: true});
        },
        (error) => {
            this.setState({answers_are_sent: false});
        }
      );

    }

    getSchedules = ()=>{
      return this.state.data.schedules;
    }

    render() {
        let data=this.state.data;
        let step=null;
        let current_step_name=this.state.step_list[this.state.step_index];
        let available_courses=this.buildAvailableCourses(this.state.answers, data);
        if(current_step_name==="initial_questions"){
          step=<InitialQuestions
          getStepIndex={this.getStepIndex}
          getUserName = {this.getUserName}
          handleStepChange={this.handleStepChange}
          getStepList={this.getStepList}
          setStepList={this.setStepList}
          getAnswers={this.getAnswers}
          setAnswers={this.setAnswers}
          />;
        }else if(current_step_name==="course_ranking_instructions"){
          step=<CourseRankingInstructions
          instructions="Veuillez lire attentivement les consignes pour le classement des cours."
          key="course_ranking_instructions"
          getStepIndex={this.getStepIndex}
          handleStepChange={this.handleStepChange}
          getStepList={this.getStepList}
          setStepList={this.setStepList}
          getAnswers={this.getAnswers}
          />;
        }else if(current_step_name==="ranking_english_courses"){
          let list_english_courses=available_courses.filter(function(value, index, arr){return value.language==="Anglais";});
          step=<CourseRankingQuestion
          instructions="Veuillez ordonner les cours d'Anglais par ordre de préférence"
          courses={list_english_courses}
          key="english_courses_ranking"
          answer="english_courses_ranking"
          getStepIndex={this.getStepIndex}
          handleStepChange={this.handleStepChange}
          getStepList={this.getStepList}
          setStepList={this.setStepList}
          getAnswers={this.getAnswers}
          setAnswers={this.setAnswers}
          getSchedules={this.getSchedules}
          />;
        }else if(current_step_name==="ranking_other_courses"){
          let list_other_courses=available_courses.filter(function(value, index, arr){return value.language!=="Anglais";});
          step=<CourseRankingQuestion
          instructions="Veuillez classer les cours de langue autre que l'Anglais par ordre de préférence"
          courses={list_other_courses}
          key="other_courses_ranking"
          answer="other_courses_ranking"
          getStepIndex={this.getStepIndex}
          handleStepChange={this.handleStepChange}
          getStepList={this.getStepList}
          setStepList={this.setStepList}
          getAnswers={this.getAnswers}
          setAnswers={this.setAnswers}
          getSchedules={this.getSchedules}
          />;
        }else if(current_step_name==="final_question"){
            step=<FinalQuestion
            instructions="Ce questionnaire est maintenant terminé. Veuillez envoyer vos réponses pour que celles-ci soient prises en compte."
            key="final-question"
            getStepIndex={this.getStepIndex}
            handleStepChange={this.handleStepChange}
            getStepList={this.getStepList}
            setStepList={this.setStepList}
            getAnswersAreSent={this.getAnswersAreSent}
            sendAnswers={this.sendAnswers}
            enoughVows={this.enoughVows}
            />;
          }
      return (
        <div className="questionnaire">{step}</div>
      );
    }
  }



class FinalQuestion extends Component {


    render() {
      let enough_vows= this.props.enoughVows();
        return (
          <div className="question">
            <QuestionInstructions text={this.props.instructions}/>
            <div className="question-content">
              <div className="final-question-container">

              {this.props.getAnswersAreSent() ? <div className="final-buttons-box">Vos réponses ont bien été envoyées.</div> :
                  [enough_vows ? null :
                    [<WarningMessage text="ATTENTION ! Vous avez classé trop peu de cours ou peu de cours compatibles entre eux. Nous vous invitons à en classer davantage avant d'envoyer vos réponses."/>,
                  <WarningMessage text="N'ignorez ce message que si vous êtes absolument certain(e) d'avoir des places dans les cours que vous avez classés."/> ],

                  <div className="final-buttons-box">
                  <FinalButton text={"Envoyer les réponses"} onClick={this.props.sendAnswers}/>
                  <FinalButton text={"Annuler le questionnaire"}/>
                  </div> ]
              }
              </div>
            </div>
            {this.props.getAnswersAreSent() ? null : <QuestionFooter handleStepChange={this.props.handleStepChange} getStepList={this.props.getStepList} getStepIndex={this.props.getStepIndex}/>}
          </div>
        );
      }
  }




export default Questionnaire;
