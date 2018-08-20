## CoffeeeHouse Scheduler - Problem and Context

Purpose of this document is to provide further context regarding the Coffeehouse Scheduler. This is meant mostly for the coffeehouse scheduler team to better understand the nature of the problem in order to derive key product insights for the scheduler. 

## Context

#### *Coffehouse Scheduling Problem*

Rice Coffeehouse is a student-run business at Rice University that employs over forty employees and serves over 4000 students and faculty. For many at Rice, Coffeehouse serves as a central hub on campus to study, meet friends, and get caffeinated. As a result, Coffeehouse must hire a lot of student employees, formally known as “Keepers of Coffee” (KOC’s, aka baristas), to meet their high demand. 

As a student-run business, student employees often have busy schedules and work part time during the academic year. Given the academic rigor at Rice University, each KOC has a weekly quota of hours that they can work. On the other hand, as the 2nd highest grossing coffeeshop in Houston, Coffeehouse has to meet tremendous business demands during peak hours.

Thus, the combination of being a student run business whilst being the 2nd highest grossing coffeeshop adds several layers of complexity to the entire scheduling process -- making it difficult to schedule appropriate shifts for all employees while meeting the required number of employees per hour to keep Coffeehouse running smoothly. 


#### *Current Situation*

Using a combination of several Google Sheets, Google forms, and email to schedule employees leads to several issues:

1. Time-consuming and tedious process for the manager to schedule employees
2. Unpleasing process for KOC's to input shift availabilities 
3. Scheduling inefficiencies within the schedule due to visual clutter and rigid data structure of the existing scheduling system 
5. Overall sense of confusion for all parties involved
6. Difficult to trade shifts given the current system 

#### *Underserved Need*

**Is the scheduling process important?**

The scheduling process is extremely important for Coffeehouse to balance business demands while respecting the busy schedules of KOC's. In fact, a personnel manager would spend over 45 hours scheduling KOCs per semester. Having an effective schedule means that Coffeehouse can effectively take in more orders during peak hours and thus increase revenue. 

**Are the users satisfied?**

No. Currently, there exists several market tools that allows organizations to schedule employees, namely [Sling](https://getsling.com/), [Homebase](https://joinhomebase.com/), Excel, and Google Calendar.

All of these schedulers provide generic, out of the box implementation for scheduling shifts. However, given Coffeehouse's scheduling process, using these tools would require Coffeehouse to design their scheduling process around the set of functionality and constraints provided by these tools. Instead, the Coffeehouse Scheduler team is designing an application around the Coffeehouse's unique and established scheduling process. In doing so, Coffeehouse wouldn't need to make any compromises to have a user-friendly, non-tedious alternative to their existing robust scheduling system.

Given that Coffeehouse has a unique scheduling system catered specifically to their busiess, market alternatives doesn't satisfy main  use cases of Coffeehouse's scheduling process. Thus, our team is uniquely positioned to build a customized scheduling appliation for Coffeehouse that address their underserved need. 

#### *Problem Scope*

It is important for us to distinguish the difference between the following two problem statements: 

 > 1. How might we create a reliable, flexible, and user-friendly alternative to schedule Coffeehouse employees, while meeting the logistical demands of Coffeehouse's scheduling process? 
 > 
> > **Included in problem scope of Coffeehouse Scheduler**

 > 2. How might we schedule employees such that it caters to the busy academic schedule of KOC's while satisfying the business and logistical demands of Coffeehouse?  
 > 
> > **Excluded in problem scope of Coffeehouse Scheduler**

**This tool is not meant to redefine or design a new scheduling process for Coffeehouse. They already have an existing scheduling process that address their problems. They just need a tool to streamline and automate this process.**

The first problem statement is concerned with creating a user-friendly and intuitive alternative to the existing scheduling tools, while the second problem statement is concerned with creating and defining a scheduling process that meets both the business demands of Coffeehouse and the academic schedules of KOC's. 

The Coffeehouse Scheduler is looking to address the functional needs of the first statement. We will be leaving the responsibility and scope of the second problem statement to Coffeehouse's Personnel Manager. 



#### Coffeehouse's Current Scheduling Process for a Semester

**2 weeks before a semester begins** (15-20 Hours)

1. Data collection
    The personnel manager sends out a long google form for all employees to fill out their availability. The form collects data from each KOC about their preference (1-4) for each shift as well as their weekly working hour quota. 


2. Spreadsheet Set-Up 
    Once all employees submit their availabilities, the personnel transfers the collected data into normalized tables in a seperate Google Sheet document. The collected information is then manually copied onto seperate Google Sheets, each keeping track of different metrics/rules. On the final google sheet document, the personnel manager manually schedules employees for each shift by referencing several google sheets to ensure all rules are followed. 


3. Fine Tuning
    Once a schedule is finalized, it is sent out via email to employees. There, employees reply to the email about shift changes and shift trades. The personnel manager monitors this email discussion forum closely and manually incorporate the changes. The final schedule is sent out. 

**Semester Begins** (4-5 Hours)
    KOC's check their finalized shifts and arrive for their scheduled shifts. KOC's use email to make shift changes as their academic class schedule often change during the first two weeks (adding / dropping classes). During this time, Coffeehouse also conducts interviews for new hires.

**Two week into the semester** (15-20 hours)
By now, most KOC's have finalized their academic schedule and new hires are introduced to the team. The entire scheduling process is repeated. 


## Findings from our Customer Research

### Don't re-design the scheduling process (Problem Scope)
The scheduling process is extremely complicated with multiple use cases. It has been perfected to meet the demands of CoffeeHouse over the years, given that we don't understand the business well enough, we should not aim to replace their existing process. Rather, we should aim to automate and streamline the existing process

### Data Visualization
Most of the time spent during the scheduling process is on switching between different excel worksheets. Each worksheet keeps track of a certain rule or metric, thus, to schedule employees for a single shifts, the personnel manager is required to check each google sheet to determine if an employee can be scheduled for a shift. 

Insight: We need to identify information that is required in each use case, particularly for scheduling employees. Our UI should dipslay the necessary data in one place so that the personnel manager can make scheduling decisions.

### Data Representation
A huge part of why the scheduling process is so tedious is how the data is currently being represented. There is a lot of reduncy, the google sheets have overfilled cells, and it is difficult for a human to keep track of multiple congested excel sheets. 

Insight: Our database needs to represent this data in a digestable manner that is flexible enough to query and manipulate while being efficiently stored on our DB.

### Flexibility
Coffeehouse often modify and tweek their scheduling process once a year. Our design decisions need to take into account that the scheduling process requires some level of flexibility. This means that our technology should be able to scale and manipulate data in different ways. 

Insight: We will use a non-relational database (MongoDB) with GraphQL as an abstraction layer, in order to adapt to changes in the scheduling process. 

### Reliability
Scheduling is integral to how efficient CoffeeHouse runs. Thus, we need protocols in emergency cases when our server crashes or if our data gets corrupted. Uptime and availability are paramount to the success and adoption of this application. 

Insight: We will host the data seperately from our servers. This way, if our servers crash or if the application crash, the data is completely recoverable. Virtual IP swapping could also be a possibility (to have two stages of deployment). (mlab)

### Security
KOC's will be inputing their availabilities throughout the semester. Implementing secure protocols is paramount to the safety of KOC's and the data they provide. 

Insight: We will be using Rice IDP for authentiation, SSL connection, and rigid access controls. Use cases surrounding authentication and authorization needs to be thoroughly designed to meet the sufficient security requirements defined by Coffeehouse. 


