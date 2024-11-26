import dotenv from 'dotenv';
import 'express-async-errors';
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
dotenv.config();
const app = express();

// Rest of packages
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

// Security Packages
import helmet from 'helmet';
import cors from 'cors';

// SwaggerUI
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// Middlewares
import notFoundMiddleware from './middleware/notFound';
import errorHandlerMiddleware from './middleware/errorHandler';

// EJS Configurations
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import skillRoutes from './routes/skill.routes';
import projectRoutes from './routes/project.routes';

app.set('trust proxy', 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", 'https://cdn.jsdelivr.net'], // Allow external scripts (Bootstrap, etc.)
        'style-src': [
          "'self'",
          'https://cdn.jsdelivr.net',
          'https://fonts.googleapis.com',
          "'unsafe-inline'", // Enable inline styles if necessary
        ],
        'font-src': [
          "'self'",
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
        ],
        'img-src': ["'self'", 'https://res.cloudinary.com', 'data:'],
        'connect-src': ["'self'"], // Allow API requests if necessary
        'frame-src': ["'self'"], // Allow iframe sources if necessary
      },
    },
  }),
);
app.use(
  cors({
    origin: 'http://localhost:3001', // Frontend URL
    credentials: true, // Allow cookies
  }),
);
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
  }),
);

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'",
  );
  next();
});
// Serve static files
app.use(express.static('src/views'));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', async (req: Request, res: Response) => {
  try {
    // Fetch users from the database
    const users = await prisma.user.findMany({
      include: {
        skills: true, // Include related skills
      },
    });

    // Transform data to match the EJS structure
    const transformedUsers = users.map((user) => ({
      name: user.name,
      bio: user.bio || 'No bio available.',
      role: user.role,
      skills: user.skills.map((skill) => skill.name), // Extract skill names
      picture: user.profile_picture || './imgs/default-profile.png', // Default picture
      devRole: user.devRole,
    }));

    // Render the index page with user data
    res.render('index', { users: transformedUsers });
    console.log(JSON.stringify(transformedUsers, null, 2));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/skills.html', async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skills.findMany();
    res.render('skills', { skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/projects', projectRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
