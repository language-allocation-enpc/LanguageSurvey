import React, { Component } from 'react';
import { CourseBox, ChangeStepButton, FinalButton, ErrorMessage, WarningMessage
, CourseBoxList,  QuestionInstructions, QuestionFooter } from './utils'

class CourseRankingInstructions extends Component {

  render() {
      return (
        <div className="question">
          <QuestionInstructions text={this.props.instructions}/>
          <div className="question-content">
            <div className="ranking-instructions">
              <p>Vous allez devoir classer des cours par ordre de préférence parmi ceux disponibles pour vous.</p>
              <p>Ce classement sera soumis à un programme d'optimisation qui a pour but d'attibuer à chacun des cours en maximisant la satisfaction globale, ce n'est PAS UN SHOTGUN.</p>
              <p>Vous n'êtes pas tenus de classer tous les cours et seuls les cours que vous avez classés pourront vous être attribués.</p>
              <WarningMessage text={"Cependant ATTENTION ! Veillez à classer suffisamment de cours pour être certain(e) d'en avoir en cas de forte demande de vos premiers choix."}/>
              <p>Si vous avez classé trop peu de cours et que le programme n'arrive pas à vous en attribuer autant que vous en avez demandé parmi ceux classés, vous aurez moins de cours que ce que vous souhaitiez, voire aucun. </p>
              <p>Il est donc dans votre intérêt de classer un maximum de cours dans les langues que vous voulez étudier, sous peine de ne pas valider suffisamment d'ECTS.</p>
              {this.props.getAnswers().number_english_courses>0 ?
              <p></p>
              :null}
              {this.props.getAnswers().number_english_courses + this.props.getAnswers().number_other_courses>1?
              <WarningMessage text={"Veillez à classer des cours se répartissant sur différents créneaux. Seuls des cours compatibles au niveau des horaires pourront vous être attribués."}/>
              :null}
              {this.props.getAnswers().number_other_courses>0 ?
              <p>Vous pouvez classer des cours de langues différentes dans la catégorie "langues différentes de l'Anglais". Cependant vous ne pourrez étudier que deux langues à la fois (Anglais compris). Si vous classez trois langues ou plus, le programme vous en attribuera deux en fonction des disponibilités.</p>
              :null}
              {this.props.getAnswers().TOEIC==='moins de 650' ?
              <p></p>
              :null}
              <p>Vous pourrez revenir à cette page de consignes en cas de doute.</p>
            </div>
          </div>
          <QuestionFooter handleStepChange={this.props.handleStepChange} getStepList={this.props.getStepList} getStepIndex={this.props.getStepIndex}/>
        </div>
      );
    }
  }


export default CourseRankingInstructions;
