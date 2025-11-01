## Smart Slot Swapping Platform
Slot Swapper is a full-stack MERN web application designed to help users to manage their working slots.It enables users to view their assigned slots, request swaps, and approve or reject swap requests.

SlotSwapper streamlines schedule management by allowing users to:

1.Create and view their event or shift slots.

2.Mark slots as swappable.

3.Request to swap slots with others.

4.Accept or reject incoming swap requests.

### Design Choices
1. MERN Stack - Gives flexibility, rapid development and scalability

2. Context API for Auth

3. Clean CSS UI - To maintain control over styling and resposiveness

4. RESTful API Architecture – Clear separation between frontend and backend

5. Modular Codebase
   
### Local Set-up Instructions
1. Clone the repository
   
   git clone https://github.com/Yashi027/SlotSwapper.git
   
   cd SlotSwapper
2. Install Dependencies
   
   Frontend: react-router-dom
   
   Backend: express, mongoose, dotenv, cors, morgan, bcrypt, jsonwebtoken
   
3. Frontend will run on: http://localhost:5173

   Backend will run on: http://localhost:4000
   
### API EndPoints

| Method | Endpoint | Description |
|:--------|:----------|:-------------:|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/events` | Get all user events |	
| POST |	`/events` |	Create a new event/slot	|
| PATCH	| `/events/:id` |	Update event status |
| GET	| `/swap/swappable` |	Get all available swappable slots (not owned by user)	|
| POST | `/swap/request` | Create a swap request between two slots |	
| POST	| `/swap/respond/:id` |	Accept or reject a swap request	|
| GET |	`/swap/requests` |	Get all incoming and outgoing swap requests	|


