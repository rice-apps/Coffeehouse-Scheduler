# Coffeehouse Scheduler Summary Document

The purpose of this document is to communicate the following:

1. Immediate and extended goals of this project
2. Landscape of Market Alternatives
3. The functional scope of this scheduler

This document is meant for new on-boarding team members, the general public, and Coffeehouse stakeholders to better understand the overall details about the Coffeehouse Scheduler project. If you are interested in the developement and progress of this application, please refer to the Fall 18' Cofffeehouse Scheduler Product Requirement Document. 


### Table of Contents:
---
  * [Overview](#overview) 
  * [The Coffeehouse Scheduler](#the-coffeehouse-scheduler)
    * [Mission and Motivation](#mission-and-motivation)
    * [Users](#users)
    * [Goals](#goals)
    * [Market Alternatives and Underserved Needs](#market-alternatives-and-underserved-needs)
    * [MVP Functional Scope](#mvp-functional-scope)
    * [Beyond MVP](#beyond-mvp)
  * [Team Organization & Responsibilities](#team-organization-and-responsibilities)

---

## Overview
The Coffeehouse Scheduler simplifies the process for Coffeehouse to schedule employees. The scheduler provides an interface for employees to input their weekly availabilities, and an interface for a manager to use this information to schedule employees in an efficient and satisfactory manner. 

In June, the Coffeehouse Scheduler successfully launched its Alpha testing phase after 10 months of development. Next year, the immediate objective is to build out the scheduler such that it completely replaces the current scheduling process which uses a combination of several Google Sheet documents and disorganized email discussion forum system. 

Overtime, the ultimate goal is to build an autonomous scheduling application that automates at least 90% of the scheduling process, whilst maintaining the correctness and flexbility of Coffeehouse's scheduling process that caters to their heavy logistical demands. Overtime, our team is also looking towards building smart integrations with tools such as Google Calendar to provide a seamless scheduling process for Coffeehouse employees and managers. 

---
# The Coffeehouse Scheduler
## Mission and Motivation
We aim to build a reliable, flexible, and user-friendly alternative that streamlines Coffeehouse's complicated and tedious scheduling pipeline with our application. 

We approximate that over **45+ hours** is spent on the scheduling process each semester. Our team hopes to reduce this number by **ten-fold** and eventually create an application that automates a large majority of the scheduling process. This way, Coffeehouse can spend more of their time on **high-value tasks**.

###### Users 
This application is primarily built around the use cases and demands of Coffeehouse's personnel manager. 

Primary User - Coffeehouse Personnel Manager
Secondary User - KOC's

###### Goals
The immediate objective is to replace Google Sheets as the primary method of scheduling employees via a web application. Later on down the line, we hope to add features which would supercharge the scheduling process, including third-party integration with employee calendars and more. 

Our long term mission is to  automate the process of scheduling employees through efficient scheduling algorithms and a provide robust set of features that would do more than a human could. 

## Market Alternatives and Underserved Need
Currently, there exists several tools that allows organizations to schedule employees, namely [Sling](https://getsling.com/), [Homebase](https://joinhomebase.com/), Excel, and Google Calendar.

All of these schedulers provide generic, out of the box implementation for scheduling shifts. However, given Coffeehouse's scheduling process, using these tools would require Coffeehouse to design their scheduling process around the set of functionality and constraints provided by these tools. Instead, the Coffeehouse Scheduler team is designing an application around the Coffeehouse's unique and established scheduling process. In doing so, Coffeehouse wouldn't need to make any compromises to have a user-friendly, non-tedious alternative to their existing robust scheduling system.

## MVP Functional Scope

The goal of the MVP is to replace Google Sheets as a primary tool to collect KOC availability information and schedule KOC's. 

Thus the functional scope of our MVP can be defined and broken down to the following: 

As a KOC, 
* I can input my shift availability 
* I can view my designated shift schedule
* I can view whether other KOC's are available for a shift that I am scheduled for
* I cannot view the availability of other KOC's
* I can trade shifts with other KOC's
* [Add-On] Need to be able to input availabilities and view schedule for multiple calendars

As a Coffeehouse Personnel Manager,
* I can view the availabilities of every KOC
* I can view all relevant information to schedule KOC's for a single shift
* I can schedule employees for every shift without violating scheduling rules (overscheduling/underscheduling employees, overscheduling/underscheduling for a shift, etc)
* I can edit the # of employees required for a shift
* I can add and remove employees
* [Add-on] Need to be able to create/delete/schedule multiple calendars

## Beyond MVP
In light of Agile principles, this will be TBD when our team reach this stage. However, you can expect the functional scope to be primarily concerned with automation and third party integrations. 


## Team Organization and Responsibilities

**Product Owner:** Will Mundy & Jeffrey Wang
_Responsibilities:_ 
* Resonsponsible for end to end delivery of this product
* Define roadmap, vision, and strategy for product
* Lead team according to roadmap, plan scrums & sprints, perform code review, make high-level product decisions

**Scrum Master:** Rotational
_Responsibilities:_ 
* Takes notes at scrum
* Responsible for managing the Zenhub board for the scrum & sprint (stories)
* Responsible for removing blockers for team
* Responsible for managing and updating documentation 

**Developers:** Will Mundy, Jeffrey Wang, Jamie Tan, Justin Fan, Danny Andreini
_Responsibilities:_ 
* Code and particpate in all aspects of product planning and implementation
* Provide ideas which supplement the features laid out in the vision and roadmap, provide insights, feedback, and questions pertaining to product and overall vision, come up with user stories to improve product, make decisions on execution of features

**Stakeholders:** Coffeehouse Personnel Manager (Sydney Garrett) and all KOC's
_Responsibilities:_ 
* Aid developement team in providing feedback during testing phases
* Maintain direct communication with the team regarding changes for the scheduling process
* Participate in bi-monthly session with development teams

---



