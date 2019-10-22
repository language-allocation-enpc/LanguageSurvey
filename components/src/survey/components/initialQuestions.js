import { MenuItem, Select, TextField, Typography } from "@material-ui/core";
import React, { Component } from "react";
import { ErrorMessage, QuestionFooter, QuestionInstructions } from "./utils";

class InitialQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = { error_messages: [] };
  }

  handleInputChange = event => {
    const target = event.target;
    const value =
      target.type === "number"
        ? Math.min(Math.max(target.value, 0), 4)
        : target.type === "text"
        ? target.value.substring(0, 200)
        : target.value;
    const name = target.name;

    let new_answers = this.props.getAnswers();
    new_answers[name] = value;
    this.props.setAnswers(new_answers);
  };

  verificationFunction = () => {
    let answers = this.props.getAnswers();
    let all_questions_answered_properly =
      answers.year !== "" &&
      answers.TOEIC !== "" &&
      !(answers.number_english_courses === 0 && answers.justification_no_english === "") &&
      !(
        answers.number_english_courses === 0 &&
        answers.justification_no_english === "Autre" &&
        answers.justification_no_english_text === ""
      );
    let current_error_messages = [];
    if (!all_questions_answered_properly) {
      current_error_messages.push(<ErrorMessage text="Veuillez répondre à toutes les questions de cette page." />);
    }
    this.setState({ error_messages: current_error_messages });
    //ajouter d'autres erreurs éventuelles
    return all_questions_answered_properly;
  };

  render() {
    let additionnal_question_about_english_courses = [];
    if (this.props.getAnswers().number_english_courses < 1) {
      additionnal_question_about_english_courses.push([
        <Typography variant="subheading">Veuillez justifier l'absence de cours d'anglais dans vos choix.</Typography>,
        <Select
          name="justification_no_english"
          type="select"
          className="questionnaire-form-select"
          value={this.props.getAnswers().justification_no_english}
          onChange={this.handleInputChange}
        >
          <MenuItem value="" selected disabled hidden>
            Choisir
          </MenuItem>
          <MenuItem value="Je suis le CIM ou j'ai validé le CIM">Je suis le CIM ou j'ai validé le CIM</MenuItem>
          <MenuItem value="J'ai validé tous mes ECTS d'Anglais et l'obligation TOEIC">
            J'ai validé tous mes ECTS d'Anglais et l'obligation TOEIC
          </MenuItem>
          <MenuItem value="Je dois me concentrer sur ma LV2 ce semestre">
            Je dois me concentrer sur ma LV2 ce semestre
          </MenuItem>
          <MenuItem value="Je suis des cours hors ENPC">Je suis des cours hors ENPC</MenuItem>
          <MenuItem value="Je ne suis pas à l'ENPC ce semestre">Je ne suis pas à l'ENPC ce semestre</MenuItem>
          <MenuItem value="Je suis stagiaire étranger(e)">Je suis stagiaire étranger(e)</MenuItem>
          <MenuItem value="Autre">Autre</MenuItem>
        </Select>,
        <br />
      ]);
    }
    if (
      this.props.getAnswers().number_english_courses < 1 &&
      this.props.getAnswers().justification_no_english === "Autre"
    ) {
      additionnal_question_about_english_courses.push([
        <Typography variant="subheading">Veuillez préciser cette autre raison.</Typography>,
        <TextField
          name="justification_no_english_text"
          type="text"
          className="questionnaire-form-text"
          value={this.props.getAnswers().justification_no_english_text}
          onChange={this.handleInputChange}
        />,
        <br />
      ]);
    }
    let instructions = (
      <Typography variant="subheading" align="center">
        {"Bienvenue " + this.props.getUserName() + ". Veuillez répondre aux questions suivantes."}
      </Typography>
    );
    if (this.state.error_messages.length > 0) {
      instructions = this.state.error_messages;
    }
    return (
      <div className="question">
        <QuestionInstructions text={instructions} />
        <div className="question-content">
          <form className="initial-questions-form">
            <Typography variant="subheading">En quelle année êtes-vous ? </Typography>
            <Select
              name="year"
              type="select"
              className="questionnaire-form-select"
              value={this.props.getAnswers().year}
              onChange={this.handleInputChange}
            >
              <MenuItem value="" disabled hidden className="questionnaire-form-MenuItem">
                Choisir
              </MenuItem>
              <MenuItem value="1A" className="questionnaire-form-MenuItem">
                1A
              </MenuItem>
              <MenuItem value="2/3A" className="questionnaire-form-MenuItem">
                2/3A
              </MenuItem>
              <MenuItem value="Stagiaire étranger" className="questionnaire-form-MenuItem">
                Stagiaire étranger
              </MenuItem>
            </Select>
            <br />
            <Typography variant="subheading">Quelle note avez-vous obtenue au TOEIC ? </Typography>
            <Select
              name="TOEIC"
              type="select"
              className="questionnaire-form-select"
              value={this.props.getAnswers().TOEIC}
              onChange={this.handleInputChange}
            >
              <MenuItem value="" disabled hidden className="questionnaire-form-MenuItem">
                Choisir
              </MenuItem>
              <MenuItem value="moins de 650" className="questionnaire-form-MenuItem">
                moins de 650
              </MenuItem>
              <MenuItem value="entre 650 et 785" className="questionnaire-form-MenuItem">
                entre 650 et 785
              </MenuItem>
              <MenuItem value="plus de 785" className="questionnaire-form-MenuItem">
                plus de 785
              </MenuItem>
            </Select>
            <br />
            <Typography variant="subheading">
              Combien de cours d'Anglais souhaitez-vous suivre ? Attention, une justification sera demandée si vous ne
              souhaitez pas en suivre.
              {this.props.getAnswers().TOEIC === "moins de 650" ||
              this.props.getAnswers().TOEIC === "entre 650 et 785" ? (
                <p style={{ color: "red" }}>
                  Avec votre note au TOEIC, vous êtes invité(e) à en prendre au moins deux.
                </p>
              ) : null}
            </Typography>
            <TextField
              name="number_english_courses"
              type="number"
              className="questionnaire-form-number"
              value={this.props.getAnswers().number_english_courses}
              onChange={this.handleInputChange}
            />
            <br />
            {additionnal_question_about_english_courses}
            <Typography variant="subheading">
              Combien de cours de langues différentes de l'anglais souhaitez-vous suivre ? (Souvenez vous que les cours
              niveau débutant comptent deux créneaux.)
            </Typography>
            <TextField
              name="number_other_courses"
              type="number"
              className="questionnaire-form-number"
              value={this.props.getAnswers().number_other_courses}
              onChange={this.handleInputChange}
            />
          </form>
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

export default InitialQuestions;
