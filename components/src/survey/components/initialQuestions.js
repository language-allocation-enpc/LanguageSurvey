import React, { Component } from 'react';
import axios from 'axios';
import url from "url";
import { CourseBox, Button, ChangeStepButton, FinalButton, ErrorMessage, WarningMessage
, CourseBoxList,  QuestionInstructions, QuestionFooter } from './utils'
import error_panel from 'images/error_panel.png';

class InitialQuestions extends Component {

  constructor(props) {
    super(props);
    this.state = {error_messages: []};
  }

  handleInputChange= (event) => {
    const target = event.target;
    const value = target.type === 'number' ? Math.min(Math.max(target.value, 0), 4) : (target.type==='text' ? target.value.substring(0,200) : target.value);
    const name = target.name;

    let new_answers= this.props.getAnswers();
    new_answers[name]=value;
    this.props.setAnswers(new_answers);
  }

  verificationFunction =()=>{
    let answers=this.props.getAnswers();
    let all_questions_answered_properly=(answers.year!=='')&&(answers.TOEIC!=='')&&!((answers.number_english_courses===0)&&(answers.justification_no_english===''))&&!((answers.number_english_courses===0)&&(answers.justification_no_english==='Autre')&&(answers.justification_no_english_text===''));
    let current_error_messages=[];
    if(!all_questions_answered_properly){
      current_error_messages.push(<ErrorMessage text="Veuillez répondre à toutes les questions de cette page."/>);
    }
    this.setState({error_messages: current_error_messages});
    //ajouter d'autres erreurs éventuelles
    return all_questions_answered_properly;
  }

  render() {
    let additionnal_question_about_english_courses=[];
    if(this.props.getAnswers().number_english_courses<1)
    {
      additionnal_question_about_english_courses.push(
        [
        <label>Veuillez justifier l'absence de cours d'anglais dans vos choix.</label>,
        <select
          name="justification_no_english"
          type='select'
          className="questionnaire-form-select"
          value={this.props.getAnswers().justification_no_english}
          onChange={this.handleInputChange} >
          <option value="" selected disabled hidden>Choisir</option>
          <option value="Je suis le CIM ou j'ai validé le CIM">Je suis le CIM ou j'ai validé le CIM</option>
          <option value="J'ai validé tous mes ECTS d'Anglais et l'obligation TOEIC">J'ai validé tous mes ECTS d'Anglais et l'obligation TOEIC</option>
          <option value='Je dois me concentrer sur ma LV2 ce semestre'>Je dois me concentrer sur ma LV2 ce semestre</option>
          <option value="Je suis des cours hors ENPC">Je suis des cours hors ENPC</option>
          <option value="Je ne suis pas à l'ENPC ce semestre">Je ne suis pas à l'ENPC ce semestre</option>
          <option value="Je suis stagiaire étranger(e)">Je suis stagiaire étranger(e)</option>
          <option value='Autre'>Autre</option>
        </select>,
        <br/>
        ]
      );
    }
    if((this.props.getAnswers().number_english_courses<1)&&(this.props.getAnswers().justification_no_english==="Autre"))
    {
      additionnal_question_about_english_courses.push(
      [
      <label>Veuillez préciser cette autre raison.</label>,
      <input
        name="justification_no_english_text"
        type="text"
        className="questionnaire-form-text"
        value={this.props.getAnswers().justification_no_english_text}
        onChange={this.handleInputChange} />,
        <br/>
      ]
      );
    }
    let instructions=<p>{"Bienvenue "+this.props.getUserName()+". Veuillez répondre aux questions suivantes."}</p>;
    if(this.state.error_messages.length>0){
      instructions=this.state.error_messages;
    }
    return (
      <div className="question">
      <QuestionInstructions text={instructions}/>
      <div className="question-content">
      <form className="initial-questions-form">
        <label>
          En quelle année êtes-vous ? </label>
          <select
            name="year"
            type='select'
            className="questionnaire-form-select"
            value={this.props.getAnswers().year}
            onChange={this.handleInputChange} >
            <option value="" disabled hidden className="questionnaire-form-option">Choisir</option>
            <option value='1A' className="questionnaire-form-option">1A</option>
            <option value='2/3A' className="questionnaire-form-option">2/3A</option>
            <option value='Stagiaire étranger' className="questionnaire-form-option">Stagiaire étranger</option>
          </select>
          <br/>
        <label>
          Quelle note avez-vous obtenue au TOEIC ? </label>
          <select
            name="TOEIC"
            type='select'
            className="questionnaire-form-select"
            value={this.props.getAnswers().TOEIC}
            onChange={this.handleInputChange} >
            <option value="" disabled hidden className="questionnaire-form-option">Choisir</option>
            <option value='moins de 650' className="questionnaire-form-option">moins de 650</option>
            <option value='entre 650 et 785' className="questionnaire-form-option">entre 650 et 785</option>
            <option value='plus de 785' className="questionnaire-form-option">plus de 785</option>
          </select>
          <br/>
        <label>
          Combien de cours d'Anglais souhaitez-vous suivre ? Attention, une justification sera demandée si vous ne souhaitez pas en suivre.
          {this.props.getAnswers().TOEIC==='moins de 650' || this.props.getAnswers().TOEIC==='entre 650 et 785' ? <p style={{color: "red"}}>Avec votre note au TOEIC, vous êtes invité(e) à en prendre au moins deux.</p>:null}
          </label>
          <input
            name="number_english_courses"
            type="number"
            className="questionnaire-form-number"
            value={this.props.getAnswers().number_english_courses}
            onChange={this.handleInputChange} />
          <br/>
        {additionnal_question_about_english_courses}
        <label>
          Combien de cours de langues différentes de l'anglais souhaitez-vous suivre ? (Souvenez vous que les cours niveau débutant comptent deux créneaux.)</label>
          <input
            name="number_other_courses"
            type="number"
            className="questionnaire-form-number"
            value={this.props.getAnswers().number_other_courses}
            onChange={this.handleInputChange} />
      </form>
      </div>
      <QuestionFooter handleStepChange={this.props.handleStepChange} getStepList={this.props.getStepList} getStepIndex={this.props.getStepIndex} verificationFunction={this.verificationFunction}/>
      </div>
    );
  }
}

export default InitialQuestions;
