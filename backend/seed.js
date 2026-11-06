const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Course = require("./models/Course");
const User = require("./models/User");
const Registration = require("./models/Registration");

const seedCourses = [
  // Computer Science & Engineering (CSE)
  {
    courseId: "CS101",
    courseCode: "CS101",
    courseName: "Programming in C",
    department: "Computer Science & Engineering",
    semester: 1,
    facultyName: "Dr. Anita Rao",
    credits: 4,
    seatsAvailable: 58,
    totalSeats: 60,
    description: "Fundamentals of programming, control flow, functions, pointers and memory management.",
  },
  {
    courseId: "CS102",
    courseCode: "CS102",
    courseName: "Discrete Mathematics",
    department: "Computer Science & Engineering",
    semester: 2,
    facultyName: "Prof. Rahul Menon",
    credits: 3,
    seatsAvailable: 55,
    totalSeats: 60,
    description: "Logic, set theory, graph theory, combinatorics and relations for computation.",
  },
  {
    courseId: "CS201",
    courseCode: "CS201",
    courseName: "Data Structures & Algorithms",
    department: "Computer Science & Engineering",
    semester: 3,
    facultyName: "Dr. Meera Iyer",
    credits: 4,
    seatsAvailable: 59,
    totalSeats: 60,
    description: "Linked lists, stacks, queues, binary search trees, heaps, graph traversal and hashing.",
  },
  {
    courseId: "CS202",
    courseCode: "CS202",
    courseName: "Object Oriented Programming (Java)",
    department: "Computer Science & Engineering",
    semester: 3,
    facultyName: "Prof. Kiran Kumar",
    credits: 3,
    seatsAvailable: 50,
    totalSeats: 50,
    description: "Classes, polymorphism, inheritance, exception handling and design patterns.",
  },
  {
    courseId: "CS301",
    courseCode: "CS301",
    courseName: "Database Management Systems",
    department: "Computer Science & Engineering",
    semester: 4,
    facultyName: "Dr. Sunita Sharma",
    credits: 4,
    seatsAvailable: 44,
    totalSeats: 45,
    description: "Relational algebra, SQL, normal forms, indexing, ACID transactions and NoSQL MongoDB.",
  },
  {
    courseId: "CS302",
    courseCode: "CS302",
    courseName: "Operating Systems",
    department: "Computer Science & Engineering",
    semester: 4,
    facultyName: "Prof. Vikram Singh",
    credits: 3,
    seatsAvailable: 50,
    totalSeats: 50,
    description: "Process scheduling, thread synchronization, deadlocks, paging and virtual memory.",
  },
  {
    courseId: "CS303",
    courseCode: "CS303",
    courseName: "Computer Networks",
    department: "Computer Science & Engineering",
    semester: 5,
    facultyName: "Dr. Neha Gupta",
    credits: 3,
    seatsAvailable: 40,
    totalSeats: 40,
    description: "OSI architecture, TCP/UDP sockets, routing algorithms, DNS, HTTP and network security.",
  },
  {
    courseId: "CS401",
    courseCode: "CS401",
    courseName: "Full Stack Web Technologies (MERN)",
    department: "Computer Science & Engineering",
    semester: 5,
    facultyName: "Prof. Arjun Reddy",
    credits: 4,
    seatsAvailable: 39,
    totalSeats: 40,
    description: "Building production full-stack web applications with React, Express and MongoDB.",
  },
  {
    courseId: "CS402",
    courseCode: "CS402",
    courseName: "Machine Learning & AI",
    department: "Computer Science & Engineering",
    semester: 6,
    facultyName: "Dr. Priya Nair",
    credits: 4,
    seatsAvailable: 35,
    totalSeats: 35,
    description: "Supervised & unsupervised learning, regression, classification, clustering and neural networks.",
  },
  {
    courseId: "CS403",
    courseCode: "CS403",
    courseName: "Cloud Computing & DevOps",
    department: "Computer Science & Engineering",
    semester: 6,
    facultyName: "Prof. Sanjay Patel",
    credits: 3,
    seatsAvailable: 30,
    totalSeats: 30,
    description: "Cloud infrastructure, Docker containers, Kubernetes, CI/CD pipelines and AWS/GCP basics.",
  },

  // Electronics & Communication Engineering (ECE)
  {
    courseId: "EC201",
    courseCode: "EC201",
    courseName: "Digital Electronics & Logic Design",
    department: "Electronics & Communication",
    semester: 3,
    facultyName: "Prof. Radhika Nair",
    credits: 4,
    seatsAvailable: 50,
    totalSeats: 50,
    description: "Boolean algebra, combinational logic, synchronous sequential circuits and Verilog HDL.",
  },
  {
    courseId: "EC301",
    courseCode: "EC301",
    courseName: "Signals & Systems Analysis",
    department: "Electronics & Communication",
    semester: 4,
    facultyName: "Dr. Senthil Nathan",
    credits: 4,
    seatsAvailable: 45,
    totalSeats: 45,
    description: "Continuous and discrete-time signals, Fourier transforms, Laplace and Z-transforms with DSP filters.",
  },
  {
    courseId: "EC302",
    courseCode: "EC302",
    courseName: "Microprocessors & Embedded Systems",
    department: "Electronics & Communication",
    semester: 5,
    facultyName: "Prof. Ananya Roy",
    credits: 3,
    seatsAvailable: 40,
    totalSeats: 40,
    description: "ARM Cortex architecture, GPIO programming, sensor interfacing, and RTOS fundamentals.",
  },
  {
    courseId: "EC401",
    courseCode: "EC401",
    courseName: "VLSI System Design",
    department: "Electronics & Communication",
    semester: 6,
    facultyName: "Dr. Rajesh Varma",
    credits: 4,
    seatsAvailable: 40,
    totalSeats: 40,
    description: "CMOS layout design, static timing analysis, FPGA synthesis and ASIC physical design.",
  },
  {
    courseId: "EC402",
    courseCode: "EC402",
    courseName: "Wireless & Mobile Communications",
    department: "Electronics & Communication",
    semester: 7,
    facultyName: "Prof. P. K. Mishra",
    credits: 3,
    seatsAvailable: 35,
    totalSeats: 35,
    description: "Cellular architecture, 5G NR physical layer, MIMO, beamforming and RF link budgets.",
  },

  // Electrical & Electronics Engineering (EEE)
  {
    courseId: "EE201",
    courseCode: "EE201",
    courseName: "Electric Circuit Theory & Networks",
    department: "Electrical & Electronics",
    semester: 3,
    facultyName: "Dr. K. Ramanathan",
    credits: 4,
    seatsAvailable: 50,
    totalSeats: 50,
    description: "Mesh and nodal analysis, network theorems, transient state analysis and three-phase balanced systems.",
  },
  {
    courseId: "EE301",
    courseCode: "EE301",
    courseName: "Electrical Machines & Transformers",
    department: "Electrical & Electronics",
    semester: 4,
    facultyName: "Prof. Geetha Swamy",
    credits: 4,
    seatsAvailable: 45,
    totalSeats: 45,
    description: "DC motors, synchronous generators, induction machines and transformer efficiency testing.",
  },
  {
    courseId: "EE302",
    courseCode: "EE302",
    courseName: "Power Systems Engineering",
    department: "Electrical & Electronics",
    semester: 5,
    facultyName: "Dr. V. Madhavan",
    credits: 4,
    seatsAvailable: 40,
    totalSeats: 40,
    description: "Transmission line parameters, load flow analysis, fault analysis and protection relays.",
  },
  {
    courseId: "EE401",
    courseCode: "EE401",
    courseName: "Renewable Energy & Smart Grids",
    department: "Electrical & Electronics",
    semester: 6,
    facultyName: "Prof. Sanjay Deshmukh",
    credits: 3,
    seatsAvailable: 40,
    totalSeats: 40,
    description: "Solar photovoltaic integration, wind energy conversion, battery storage and smart grid telemetries.",
  },
  {
    courseId: "EE402",
    courseCode: "EE402",
    courseName: "Power Electronics & Industrial Drives",
    department: "Electrical & Electronics",
    semester: 7,
    facultyName: "Dr. T. Hariprasad",
    credits: 4,
    seatsAvailable: 35,
    totalSeats: 35,
    description: "IGBT/MOSFET switching, inverters, buck-boost converters and vector control of AC drives.",
  },

  // Mechanical Engineering
  {
    courseId: "ME201",
    courseCode: "ME201",
    courseName: "Engineering Thermodynamics",
    department: "Mechanical Engineering",
    semester: 3,
    facultyName: "Dr. Ramesh Kulkarni",
    credits: 4,
    seatsAvailable: 50,
    totalSeats: 50,
    description: "Laws of thermodynamics, entropy, Rankine and Brayton cycles, refrigeration systems.",
  },
  {
    courseId: "ME301",
    courseCode: "ME301",
    courseName: "Fluid Mechanics & Turbo Machinery",
    department: "Mechanical Engineering",
    semester: 4,
    facultyName: "Prof. Suresh Patil",
    credits: 4,
    seatsAvailable: 45,
    totalSeats: 45,
    description: "Bernoulli's theorem, boundary layer theory, Pelton wheel and Francis turbine dynamics.",
  },
  {
    courseId: "ME302",
    courseCode: "ME302",
    courseName: "Kinematics & Machine Dynamics",
    department: "Mechanical Engineering",
    semester: 5,
    facultyName: "Dr. Amit Joshi",
    credits: 4,
    seatsAvailable: 40,
    totalSeats: 40,
    description: "Gear trains, cam profiles, flywheel balancing and vibration analysis of mechanical systems.",
  },
  {
    courseId: "ME401",
    courseCode: "ME401",
    courseName: "Heat Transfer & Thermal Design",
    department: "Mechanical Engineering",
    semester: 6,
    facultyName: "Prof. B. N. Rao",
    credits: 4,
    seatsAvailable: 40,
    totalSeats: 40,
    description: "Conduction, convective boundary layers, radiation exchange and heat exchanger LMTD methods.",
  },
  {
    courseId: "ME402",
    courseCode: "ME402",
    courseName: "Robotics & Industrial Automation",
    department: "Mechanical Engineering",
    semester: 7,
    facultyName: "Dr. Prakash Verma",
    credits: 3,
    seatsAvailable: 35,
    totalSeats: 35,
    description: "Robot forward/inverse kinematics, trajectory planning, PLC automation and pneumatic circuits.",
  },

  // Civil Engineering
  {
    courseId: "CE201",
    courseCode: "CE201",
    courseName: "Mechanics of Solids & Materials",
    department: "Civil Engineering",
    semester: 3,
    facultyName: "Dr. S. K. Mukherjee",
    credits: 4,
    seatsAvailable: 50,
    totalSeats: 50,
    description: "Stress-strain tensors, shear force and bending moment diagrams, deflection of beams.",
  },
  {
    courseId: "CE301",
    courseCode: "CE301",
    courseName: "Surveying & Advanced Geomatics",
    department: "Civil Engineering",
    semester: 4,
    facultyName: "Prof. Nalini Mohan",
    credits: 3,
    seatsAvailable: 45,
    totalSeats: 45,
    description: "Total station leveling, GPS/GNSS surveying, GIS spatial modeling and drone photogrammetry.",
  },
  {
    courseId: "CE302",
    courseCode: "CE302",
    courseName: "Structural Analysis & Reinforced Concrete",
    department: "Civil Engineering",
    semester: 5,
    facultyName: "Dr. Anand Bhatt",
    credits: 4,
    seatsAvailable: 40,
    totalSeats: 40,
    description: "Moment distribution method, limit state design of RCC beams, columns and slabs.",
  },
  {
    courseId: "CE401",
    courseCode: "CE401",
    courseName: "Environmental Engineering & Sustainability",
    department: "Civil Engineering",
    semester: 6,
    facultyName: "Prof. Deepa Nair",
    credits: 3,
    seatsAvailable: 40,
    totalSeats: 40,
    description: "Water treatment unit processes, wastewater biological purification and solid waste disposal.",
  },
  {
    courseId: "CE402",
    courseCode: "CE402",
    courseName: "Transportation & Highway Engineering",
    department: "Civil Engineering",
    semester: 7,
    facultyName: "Dr. M. G. Hegde",
    credits: 3,
    seatsAvailable: 35,
    totalSeats: 35,
    description: "Geometric design of highways, pavement design, traffic flow theory and intersection signal design.",
  },
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI not specified in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // 1. Seed Courses
    for (const c of seedCourses) {
      await Course.findOneAndUpdate({ courseCode: c.courseCode }, c, { upsert: true, new: true });
    }
    console.log(`Seeded ${seedCourses.length} courses.`);

    // 2. Seed Default Admin
    const adminEmail = "admin@abc.edu";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        userId: "ADM2025001",
        name: "Admin Officer",
        email: adminEmail,
        password: "admin123",
        role: "admin",
        department: "Academic Affairs",
        semester: 1,
        phone: "+91 98765 43210",
      });
      console.log("Created Admin account: admin@abc.edu / admin123");
    } else {
      admin.role = "admin";
      await admin.save();
    }

    // 3. Seed Sample Student
    const studentEmail = "student@abc.edu";
    let student = await User.findOne({ email: studentEmail });
    if (!student) {
      student = await User.create({
        userId: "STU2025101",
        name: "Aarav Sharma",
        email: studentEmail,
        password: "student123",
        role: "student",
        department: "Computer Science",
        semester: 5,
        phone: "+91 91234 56789",
      });
      console.log("Created Sample Student account: student@abc.edu / student123");
    }

    // 4. Seed another student for admin report demo
    const student2Email = "ananya@abc.edu";
    let student2 = await User.findOne({ email: student2Email });
    if (!student2) {
      student2 = await User.create({
        userId: "STU2025102",
        name: "Ananya Patel",
        email: student2Email,
        password: "student123",
        role: "student",
        department: "Information Technology",
        semester: 3,
        phone: "+91 99887 66554",
      });
      console.log("Created Sample Student 2: ananya@abc.edu / student123");
    }

    // 5. Seed initial registrations
    const mernCourse = await Course.findOne({ courseCode: "CS401" });
    const dsaCourse = await Course.findOne({ courseCode: "CS201" });
    const cCourse = await Course.findOne({ courseCode: "CS101" });

    if (student && mernCourse) {
      const reg1 = await Registration.findOne({ studentId: student._id, courseId: mernCourse._id });
      if (!reg1) {
        await Registration.create({
          registrationId: "REG-2025001",
          studentId: student._id,
          courseId: mernCourse._id,
          approvalStatus: "Approved",
          registrationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          adminComments: "Pre-requisite criteria verified.",
        });
      }
    }

    if (student && cCourse) {
      const reg2 = await Registration.findOne({ studentId: student._id, courseId: cCourse._id });
      if (!reg2) {
        await Registration.create({
          registrationId: "REG-2025002",
          studentId: student._id,
          courseId: cCourse._id,
          approvalStatus: "Pending",
          registrationDate: new Date(),
        });
      }
    }

    if (student2 && dsaCourse) {
      const reg3 = await Registration.findOne({ studentId: student2._id, courseId: dsaCourse._id });
      if (!reg3) {
        await Registration.create({
          registrationId: "REG-2025003",
          studentId: student2._id,
          courseId: dsaCourse._id,
          approvalStatus: "Pending",
          registrationDate: new Date(),
        });
      }
    }

    console.log("Seeding finished successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
