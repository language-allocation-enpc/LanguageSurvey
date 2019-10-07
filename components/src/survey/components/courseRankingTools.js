import { Button, MenuItem, Select, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/AddCircle";
import React, { Component } from "react";
import { CourseBox, CourseBoxList } from "./utils";

class CourseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_filters: { language: "", schedule: "", level: "" },
      criteria_with_options: this.buildCriteriaWithOptions()
    }; //pas de filtrage par défaut
  }

  getCurrentFilters = () => {
    return this.state.current_filters;
  };

  handleFilterChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let new_filters = this.state.current_filters;
    new_filters[name] = value;
    this.setState({ current_filters: new_filters });
  };

  buildCriteriaWithOptions = () => {
    let list_languages = [];
    let list_schedules = [];
    let list_levels = [];
    for (let index = 0; index < this.props.courses.length; index++) {
      let current_course = this.props.courses[index];
      if (!list_languages.includes(current_course.language)) {
        list_languages.push(current_course.language);
      }
      if (!list_levels.includes(current_course.level)) {
        list_levels.push(current_course.level);
      }
      for (let index_schedule = 0; index_schedule < current_course.creneaux.length; index_schedule++) {
        let schedule = current_course.creneaux[index_schedule];
        if (!list_schedules.includes(schedule)) {
          list_schedules.push(schedule);
        }
      }
    }
    let criteria_with_options = {};
    if (list_languages.length > 1) {
      criteria_with_options.language = list_languages;
    }
    if (list_schedules.length > 1) {
      criteria_with_options.schedule = list_schedules;
    }
    if (list_levels.length > 1) {
      criteria_with_options.level = list_levels;
    }
    return criteria_with_options;
  };

  buildListCoursesToDisplay = () => {
    let list_courses_to_display = this.props.courses;
    if (this.state.current_filters.language !== "") {
      list_courses_to_display = list_courses_to_display.filter((value, index, arr) => {
        return value.language === this.state.current_filters.language;
      });
    }
    if (this.state.current_filters.schedule !== "") {
      list_courses_to_display = list_courses_to_display.filter((value, index, arr) => {
        return value.creneaux.includes(parseInt(this.state.current_filters.schedule));
      });
    }
    if (this.state.current_filters.level !== "") {
      list_courses_to_display = list_courses_to_display.filter((value, index, arr) => {
        return value.level === this.state.current_filters.level;
      });
    }
    return list_courses_to_display;
  };

  render() {
    let list_display = [];
    let list_courses_to_display = this.buildListCoursesToDisplay();
    for (let index = 0; index < list_courses_to_display.length; index++) {
      list_display.push(
        <CourseBox
          key={index}
          course={list_courses_to_display[index]}
          getSchedules={this.props.getSchedules}
          buttons={[
            <Button onClick={() => this.props.handleAddCourseToRanking(list_courses_to_display[index])}>
              <AddIcon style={{ color: "green" }} />
            </Button>
          ]}
        />
      );
    }
    return (
      <div className="course-list">
        <h1 className="course-list-header">Liste des cours</h1>
        <CourseListFilter
          criteriaWithOptions={this.state.criteria_with_options}
          getCurrentFilters={this.getCurrentFilters}
          handleFilterChange={this.handleFilterChange}
          getSchedules={this.props.getSchedules}
        />
        <CourseBoxList content={list_display} emptyText="Aucun cours à afficher avec ce filtrage." />
      </div>
    );
  }
}

class CourseListFilter extends Component {
  render() {
    let schedules = this.props.getSchedules();
    let criteria_selection = [];
    for (let criterion in this.props.criteriaWithOptions) {
      let list_options = [<option value="" key={""}></option>];
      for (let index = 0; index < this.props.criteriaWithOptions[criterion].length; index++) {
        let option_name = this.props.criteriaWithOptions[criterion][index];
        if (criterion !== "schedule") {
          list_options.push(
            <MenuItem value={option_name} key={option_name}>
              {option_name}
            </MenuItem>
          );
        } else {
          list_options.push(
            <MenuItem value={option_name} key={option_name}>
              {schedules[option_name].day +
                (schedules[option_name].day === "hors-créneaux"
                  ? ""
                  : " " + schedules[option_name].begin + "-" + schedules[option_name].end)}
            </MenuItem>
          );
        }
      }
      criteria_selection.push(
        <div className="course-list-filter-option" key={criterion}>
          <Typography variant="h5" style={{ float: "left", paddingRight: "15px" }}>
            {criterion === "language"
              ? "Langue : "
              : criterion === "schedule"
              ? "Horaire : "
              : criterion === "level"
              ? "Niveau : "
              : "erreur"}
          </Typography>
          <Select
            name={criterion}
            type="select"
            style={{ float: "right" }}
            value={this.props.getCurrentFilters()[criterion]}
            onChange={this.props.handleFilterChange}
          >
            {list_options}
          </Select>
        </div>
      );
    }

    return <div className="course-list-filter">{criteria_selection}</div>;
  }
}
class CourseRanking extends Component {
  render() {
    let ranking_display = [];
    for (let index = 0; index < this.props.ranking.length; index++) {
      ranking_display.push(
        <CourseBox
          key={index}
          course={this.props.ranking[index]}
          getSchedules={this.props.getSchedules}
          buttons={[
            <Button text="monter" onClick={() => this.props.handleRankUp(index)} key="monter" />,
            <Button text="descendre" onClick={() => this.props.handleRankDown(index)} key="descendre" />,
            <Button text="supprimer" onClick={() => this.props.handleDeletionFromRanking(index)} key="supprimer" />
          ]}
        />
      );
    }
    return (
      <div className="course-ranking">
        <h1 className="course-ranking-header">Mon classement</h1>
        <CourseBoxList
          content={ranking_display}
          emptyText="Vous n'avez pas encore classé de cours dans cette catégorie."
        />
      </div>
    );
  }
}

export { CourseRanking, CourseListFilter, CourseList };
