const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// home route
router.get("/", checkAuthenticated, async (req, res) => {
  const job_opening = await knex("jobs.job_opening").select();
  const skill = await knex("admin.skill").select();
  res.render("index", { job_opening, skill });
});

// register get route
router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

// register post route
router.post("/register", checkNotAuthenticated, async (req, res) => {
  const { username, password } = req.body;
  const userFound = await knex("admin.users")
    .where({ user_name: username })
    .first()
    .then((row) => {
      if (row) {
        return row.user_name;
      }
      return row;
    });
  if (userFound === username) {
    req.flash("error", "User with that username already exists");
    res.redirect("/register");
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      knex("admin.users")
        .insert({
          user_name: username,
          password: hashedPassword,
        })
        .then(() => {
          res.redirect("/login");
        });
    } catch (error) {
      console.log(error);
      req.flash("error", "Cant insert");
      res.redirect("/register");
    }
  }
});

// login get route
router.get("/login", checkNotAuthenticated, (req, res) => {
  knex("admin.users").then((results) => {
    if (results != 0) {
      res.render("login", {
        title: "Log In",
      });
    } else {
      res.redirect("/register");
    }
  });
});

// login post route
router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

<<<<<<< HEAD
// register post route
router.post('/register', checkNotAuthenticated, async (req, res) => {
        const { username, password } = req.body;
        const userFound = await knex('admin.users')
                .where({ user_name: username })
                .first()
                .then((row) => {
                        if (row) {
                                return row.user_name;
                        }
                        return row;
                });
        if (userFound === username) {
                req.flash('error', 'User with that username already exists');
                res.redirect('/register');
        } else {
                try {
                        const hashedPassword = await bcrypt.hash(password, 10);
                        knex('admin.users')
                                .insert({
                                        user_name: username,
                                        password: hashedPassword,
                                })
                                .then(() => {
                                        res.redirect('/login');
                                });
                } catch (error) {
                        console.log(error);
                        req.flash('error', 'Cant insert');
                        res.redirect('/register');
                }
        }
});

function uniqueId(jobIdColumn) {
        const len = jobIdColumn.length;
        if (jobIdColumn != 0) {
                return jobIdColumn[len - 1].job_id + 1;
        }
        return 1;
}

// job-requirement get route
router.get('/job-requirement', async (req, res) => {
        const skill = await knex('admin.skill');
        const dept = await knex('admin.department');
        const jobType = await knex('admin.job_type');
        const job = await knex('jobs.job_opening');
        const hrAssessment = await knex('admin.remarks');
        const jobQuestion = await knex('jobs.question');
        const question = await knex('question.question');
        const unique = uniqueId(job);
        res.render('jobRequirement', { skill, dept, jobType, job, unique, hrAssessment, question });
});

// job-requirement post route
router.post('/job-requirement', async (req, res) => {
        const {
                jobId,
                jobTitle,
                department,
                salaryRange,
                careerLevel,
                workType,
                jobDesc,
                yearsOfExp,
                examScore,
                hrAssessment,
                skill_id_1,
                skill_level_1,
                skill_id_2,
                skill_level_2,
        } = req.body;
        knex('jobs.job_opening')
                .insert({
                        job_id: jobId,
                        job_title: jobTitle,
                        job_dept: department,
                        max_salary: salaryRange,
                        position_level: careerLevel,
                        job_type: workType,
                        job_description: jobDesc,
                        min_years_experience: yearsOfExp,
                        exam_score: examScore,
                        hr_rating: hrAssessment,
                })
                .then(() => {
                        knex('jobs.skill')
                                .insert({
                                        job_id: jobId,
                                        skill_id_1,
                                        skill_level_1,
                                        skill_id_2,
                                        skill_level_2,
                                })
                                .then(() => {
                                        res.redirect(`/job-requirement/${jobId}`);
                                });
                });
});

// job-requirement update get route
router.get('/job-requirement/:job_id', async (req, res) => {
        const jobId = req.params.job_id;
        const skill = await knex('admin.skill').select();
        const dept = await knex('admin.department');
        const jobType = await knex('admin.job_type');
        const hrRemarks = await knex('admin.remarks');
        const job = await knex('jobs.job_opening').where('job_id', jobId);
        const unique = jobId;
        res.render('editJobRequirement', { skill, dept, jobType, job, unique, jobId, hrRemarks });
});

// job-requirement update post route
router.post('/job-requirement/:job_id', async (req, res) => {
        const jobId = req.params.job_id;
        const {
                jobTitle,
                department,
                salaryRange,
                careerLevel,
                workType,
                jobDesc,
                yearsOfExp,
                examScore,
                hrAssessment,
                skill_id_1,
                skill_level_1,
                skill_id_2,
                skill_level_2,
        } = req.body;
        knex('jobs.job_opening')
                .update({
                        job_title: jobTitle,
                        job_dept: department,
                        max_salary: salaryRange,
                        position_level: careerLevel,
                        job_type: workType,
                        job_description: jobDesc,
                        min_years_experience: yearsOfExp,
                        exam_score: examScore,
                        hr_rating: hrAssessment,
                })
                .where('job_id', jobId)
                .then(() => {
                        knex('jobs.skill')
                                .update({
                                        skill_id_1,
                                        skill_level_1,
                                        skill_id_2,
                                        skill_level_2,
                                })
                                .where('job_id', jobId)
                                .then(() => {
                                        res.redirect(`/job-requirement/${jobId}`);
                                });
                });
});

// job-details get route
router.get('/job-details/:job_id', async (req, res) => {
        const job = await knex.select().from('jobs.job_opening').where('job_id', req.params.job_id);
        const responsi = await knex('jobs.job_details').where('job_id', req.params.job_id).andWhere('category_id', 1);
        const quali = await knex('jobs.job_details').where('job_id', req.params.job_id).andWhere('category_id', 2);
        const role = await knex('jobs.job_details').where('job_id', req.params.job_id);
        const jobId = req.params.job_id;
        res.render('jobDetails', { responsi, quali, job, role, jobId });
});

// job-details post route
router.post('/job-details/:job_id', (req, res) => {
        const { responsiDesc, qualiDesc, button, role } = req.body;
        const jobId = req.params.job_id;
        if (button === 'roleBtn') {
        } else if (button === 'responsiBtn') {
                if (!responsiDesc) res.redirect('/job-details/:job_id');
                else {
                        knex('jobs.job_details')
                                .insert({ item_description: responsiDesc, job_id: jobId, category_id: 1, role })
                                .then(() => {
                                        res.redirect(`/job-details/${jobId}`);
                                });
                }
        } else if (button === 'qualiBtn') {
                if (!qualiDesc) res.redirect('/job-details/:job_id');
                else {
                        knex('jobs.job_details')
                                .insert({ item_description: qualiDesc, job_id: jobId, category_id: 2, role })
                                .then(() => {
                                        res.redirect(`/job-details/${jobId}`);
                                });
                }
        } else if (button === 'deleteCatDetailBtn') {
                // delete category description function
                res.redirect('/job-details');
        } else if (button === 'saveBtn') {
                // save function
        }
});

// exam route
router.get('/exam/:job_id', (req, res) => {
        const jobId = req.params.job_id;
        res.render('exam', { jobId });
});

// settings
router.get('/settings', (req, res) => {
        res.render('settings');
});

// users
router.get('/users', (req, res) => {
        knex('admin.users')
                .select()
                .then((results) => {
                        res.render('users', { users: results });
                });
});

// delete user
router.get('/delete/:user_id', (req, res) => {
        knex('admin.users')
                .where('user_id', req.params.user_id)
                .del()
                .then((results) => {
                        res.redirect('/users');
                });
});

=======
>>>>>>> 19183f98e11dffed9286f1b1fcab75099a627d15
// delete/logout route
router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

module.exports = router;
