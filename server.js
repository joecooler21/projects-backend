const dotenv = require('dotenv').config({ path: __dirname + '/.env' })
const cors = require('cors')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express()
const port = 4000
const USER = process.env.USERNAME
const PASS = process.env.PASSWORD
const mongoose = require('mongoose')
const Schedule = require('.//schema/Schedule')
const Shifts = require('.//schema/Shifts')
const Employees = require('.//schema/Employees')
const { ObjectId } = require('mongodb')
const uri = `mongodb+srv://${USER}:${PASS}@cluster0.a9s39hw.mongodb.net/?retryWrites=true&w=majority`

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', router)

app.listen(port, () => {
  console.log(`Server initialized on port ${port}`)
})

mongoose.connect(uri, () => {
  console.log('db connected')
}, err => {
  console.log(err)
});

// return schedule based on calendar click, also send back the id so we can update upon deletion

router.get('/schedule/:date', async (req, res) => {
  const data = []
  const { date } = req.params
  const response = await Schedule.findOne({ date: date })
  if (!response) {
    res.send({})
    return
  }
  response.shifts.forEach(e => {
    data.push({ id: e._id, name: `${e.firstName} ${e.lastName}`, shift: `${e.startShift} - ${e.endShift}`, date: date })

  })
  res.send(data)
})

// return weekly schedule based on range of dates provided by calender click

router.get('/week/:range', async (req, res) => {
  const data = []
  const range = req.params.range.split(',')

  const response = await Schedule.find({ date : { $in : range }})

  res.send(response)
  console.log(response)

})

  

// clear entire schedule for selected day
router.delete('/clearschedule/:date', async (req, res) => {
  const { date } = req.params
  const response = await Schedule.deleteOne({ date:date })
  response.acknowledged ? res.send({message:'OK'}) : res.send({message:'FAILED'})
})

// update or add schedule entry
router.post('/schedule', async (req, res) => {

  if (req.body.type === 'ADD_SHIFT') {
    const firstName = req.body.name.split(' ')[0]
    const lastName = req.body.name.split(' ')[1]
    const startShift = req.body.shift.split(' - ')[0]
    const endShift = req.body.shift.split(' - ')[1]
    const date = req.body.date
    const data = await Schedule.findOneAndUpdate({ date: date }, {$push:{shifts:{
      firstName:firstName,
      lastName:lastName,
      startShift:startShift,
      endShift:endShift

    }}}, {upsert:true, new:true})
    res.send(data)
    return
  }

  if (req.body.type === 'EDIT_SHIFT') {
    const id = req.body.id
    const nameCopy = req.body.name.split(' ')
    const name = { firstName: nameCopy[0], lastName: nameCopy[1] }
    const shiftCopy = req.body.shift.split(' - ')
    const shift = { startShift: shiftCopy[0], endShift: shiftCopy[1] }
    const data = await Schedule.findOneAndUpdate({ 'shifts._id': ObjectId(id) },
      {
        'shifts.$.firstName': name.firstName,
        'shifts.$.lastName': name.lastName,
        'shifts.$.startShift': shift.startShift, 'shifts.$.endShift': shift.endShift
      }, { new: true })
    res.send(data)
    return
  }
})

router.post('/fill', async(req, res) => {
  const dates = req.body.dates
  // find all schedules in current month and delete
})

// delete schedule entry from shifts array in db
router.delete('/schedule/:id', async (req, res) => {
  const { id } = req.params
  const data = await Schedule.updateOne({ 'shifts._id': ObjectId(id) }, { $pull: { 'shifts': { _id: ObjectId(id) } } }, { new: true })
  if (data.acknowledged == true) {
    res.send(data)
  }
})

// send back shift list
router.get('/shifts', async (req, res) => {
  const data = []
  const response = await Shifts.find({})
  if (!response)
    return
  response.map(e => {
    data.push({ id: e._id, startShift: e.startShift, endShift: e.endShift })
  })
  res.send(data)
})

// insert a shift
router.post('/shifts', async (req, res) => {
  const data = []
  const response = await Shifts.create(req.body)
  const newShifts = await Shifts.find({})
  newShifts.map(e => {
    data.push({ id: e._id, startShift: e.startShift, endShift: e.endShift })
  })
  res.send(data)
})

// delete shift by id and return updated shift list
router.delete('/shifts/:id', async (req, res) => {
  const { id } = req.params
  const data = []
  const response = await Shifts.deleteOne({ _id: ObjectId(id) })
  if (response.acknowledged) {
    const newShifts = await Shifts.find({})
    newShifts.map(e => {
      data.push({ id: e._id, startShift: e.startShift, endShift: e.endShift })
    })
    res.send(data)
  }
})

// send back employee list
router.get('/employees', async (req, res) => {
  const data = []
  const response = await Employees.find({})
  if (!response)
    return
  response.forEach(e => {
    data.push({ id: e._id, firstName: e.firstName, lastName: e.lastName, title: e.title })
  })
  res.send(data)
})

// add an employee
router.post('/employees', async (req, res) => {
  const data = []
  const response = await Employees.create(req.body)
  if (!response) return
  const newList = await Employees.find({})
  newList.forEach(e => {
    data.push({ id: e._id, firstName: e.firstName, lastName: e.lastName, title: e.title })
  })
  res.send(data)
})

// remove an employee by id
router.delete('/employees/:id', async (req, res) => {
  const { id } = req.params
  const data = []
  const response = await Employees.deleteOne({ _id: ObjectId(id) })
  if (response.acknowledged) {
    const newEmployees = await Employees.find({})
    newEmployees.forEach(e => {
      data.push({ id: e._id, firstName: e.firstName, lastName: e.lastName, title: e.title })
    })
    res.send(data)
  }
})