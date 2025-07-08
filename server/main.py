import json
from sqlalchemy import create_engine, select, delete
from sqlalchemy.orm import Session
from models import Base, User, TouristSpot, Event
import numpy as np
from predict import get_interest_tags

class DatabaseManager:
    def __init__(self) -> None:
        DATABASE_URL = "sqlite:///data/main.db"
        engine = create_engine(DATABASE_URL, echo=False)
        Base.metadata.create_all(engine)

        self._session = Session(engine)

        with self._session as session:
            # Clear existing data
            session.query(User).delete()
            session.query(TouristSpot).delete()
            session.query(Event).delete()
            session.commit()

            with open("testdata/users.json", "r") as file:
                users_data = json.load(file)

            with open("events.json", "r") as file:
                events_data = json.load(file)

            with open("testdata/tourist_spot.json", "r") as file:
                spots_data = json.load(file)

            for user_data in users_data.get("users", []):
                user = User.from_json(user_data)
                self._session.add(user)
                session.commit()

            for spot_data in spots_data:
                spot = TouristSpot.from_json(spot_data)
                self._session.add(spot)
                session.commit()

            for event_data in events_data:
                # Skip events with None or "None" as name
                if event_data.get('name') is None or event_data.get('name') == 'None' or event_data.get('name') == 'null':
                    continue
                    
                event = Event.from_json(event_data)
                self._session.add(event)
                session.commit()

    """
    USER MANAGEMENT FUNCTIONS
    1. get_all_users: Returns a list of all users in JSON format.
    2. get_user_by_id: Returns a user by their ID in JSON format.
    3. login: Validates user credentials and returns user data in JSON format.
    4. add_user: Adds a new user to the database.
    5. delete_user: Deletes a user by their ID.
    6. update_interests: Updates the interest tags of a user by their ID.
    """
    def get_all_users(self):
        all_users = [user.to_json() for user in self._session.execute(select(User)).scalars().all()]
        return all_users
    
    def get_user_by_id(self, user_id):
        user = self._session.execute(select(User).where(User.user_id == user_id)).scalar_one_or_none()
        if user:
            return user.to_json()
        raise ValueError("User not found")
    
    def login(self, username, password):
        user = self._session.execute(select(User).where(User.username == username, User.password == password)).scalar_one_or_none()
        if user:
            return user.to_json()
        raise ValueError("Invalid username or password")

    def add_user(self, username, password):
        user = self._session.execute(select(User).where(User.username == username)).scalar_one_or_none()
        if user:
            raise ValueError("Username already exists")
        
        new_user = User(username=username, password=password)
        self._session.add(new_user)
        self._session.commit()
        return self._session.execute(select(User).where(User.username == username)).scalar_one().to_json()

    def delete_user(self, user_id):
        user = self._session.execute(select(User).where(User.user_id == user_id)).scalar_one_or_none()
        if not user:
            raise ValueError("User not found")
        
        self._session.execute(delete(User).where(User.user_id == user_id))
        self._session.commit()
    
    def update_interests(self, user_id, form_data):
        user = self._session.execute(select(User).where(User.user_id == user_id)).scalar_one_or_none()
        if not user:
            raise ValueError("User not found")
        
        array = np.array([form_data])
        # print(np.shape(array))
        
        tags = get_interest_tags(array)
        survey = form_data
        for i, code in enumerate(tags[1]):
            survey.insert(i+12, code)

        print(tags[0], survey)

        new_user = User.from_json({
            "user_id": user.user_id,
            "username": user.username,
            "password": user.password,
            "friends": user.friends,
            "survey": survey,
            "interest_tags": tags[0],
            "travel_history": user.travel_history,
            "personal_list": user.personal_list
        })
        self._session.delete(user)
        self._session.add(new_user)
        self._session.commit()
        return new_user.to_json()
    
    def check_duplicates(self, username):
        user = self._session.execute(select(User).where(User.username == username)).scalar_one_or_none()
        if user:
            return False
        return True

    def add_friend(self, user_id, friend_name):
        user = self._session.execute(select(User).where(User.user_id == user_id)).scalar_one_or_none()
        if not user:
            raise ValueError("User not found")
        
        friend = self._session.execute(select(User).where(User.username == friend_name)).scalar_one_or_none()
        if not friend:
            raise ValueError("Friend not found")
        
        if friend.user_id in user.friends:
            raise ValueError("Friend already added")
        
        friends = user.friends
        friends.append(friend.username)

        new_user = User.from_json({
            "user_id": user.user_id,
            "username": user.username,
            "password": user.password,
            "friends": friends,
            "survey": user.survey,
            "interest_tags": user.interest_tags,
            "travel_history": user.travel_history,
            "personal_list": user.personal_list
        })
        self._session.delete(user)
        self._session.add(new_user)

        return user.to_json()
    
    def get_user_by_username(self, username):
        user = self._session.execute(select(User).where(User.username == username)).scalar_one_or_none()
        if user:
            return user.to_json()
        raise ValueError("User not found")
    #END OF USER MANAGEMENT FUNCTIONS

    """
    TOURIST SPOT MANAGEMENT FUNCTIONS
    1. get_all_spots: Returns a list of all tourist spots in JSON format.
    2. get_spot_by_id: Returns a tourist spot by its ID in JSON
    3. update_travel: add to the travel_history and return edited user
    4. save_ts: save tourist spot ids to the user's personal_list and returns the edited user
    """
    def get_all_spots(self, user_id=None):
        all_spots = [spot.to_json() for spot in self._session.execute(select(TouristSpot)).scalars().all()]
        user = self._session.execute(select(User).where(User.user_id == user_id)).scalar_one_or_none() if user_id else None

        if user:
            recommend = []
            for spot in all_spots:
                for tag in spot['interest_tags']:
                    if tag in user.interest_tags:
                        recommend.append(spot)
                        break
            return recommend
        
        return all_spots
    
    def get_spots_map(self):
        all_spots = [spot.to_json() for spot in self._session.execute(select(TouristSpot)).scalars().all()]
        return all_spots
    
    def get_spot_by_id(self, spot_id):
        spot = self._session.execute(select(TouristSpot).where(TouristSpot.spot_id == spot_id)).scalar_one_or_none()
        if spot:
            return spot.to_json()
        raise ValueError("Tourist spot not found")
    
    def update_travel(self, user_id, spot_id):
        user = self._session.execute(select(User).where(User.user_id == user_id)).scalar_one_or_none()
        spot = self._session.execute(select(TouristSpot).where(TouristSpot.spot_id == spot_id)).scalar_one_or_none()

        if not spot:
            raise ValueError('Tourist Spot not found')
        if not user:
            raise ValueError('User not found')

        #I DONT KNOW WHY THIS WORKS
        travel_history = user.travel_history
        travel_history.append(spot.spot_id)

        new_user = User.from_json({
            "user_id": user.user_id,
            "username": user.username,
            "password": user.password,
            "friends": user.friends,
            "survey": user.survey,
            "interest_tags": user.interest_tags,
            "travel_history": travel_history,
            "personal_list": user.personal_list
        })
        self._session.delete(user)
        self._session.add(new_user)
        #AAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHH

        self._session.commit()

        return new_user.to_json()
    
    def save_ts(self, user_id, spot_id):
        user = self._session.execute(select(User).where(User.user_id == user_id)).scalar_one_or_none()
        spot = self._session.execute(select(TouristSpot).where(TouristSpot.spot_id == spot_id)).scalar_one_or_none()

        if not spot:
            raise ValueError('Tourist Spot not found')
        if not user:
            raise ValueError('User not found')

        #I DONT KNOW WHY THIS WORKS
        personal_list = user.personal_list
        personal_list.append(spot.spot_id)

        new_user = User.from_json({
            "user_id": user.user_id,
            "username": user.username,
            "password": user.password,
            "friends": user.friends,
            "survey": user.survey,
            "interest_tags": user.interest_tags,
            "travel_history": user.travel_history,
            "personal_list": personal_list
        })
        self._session.delete(user)
        self._session.add(new_user)
        #AAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHH

        self._session.commit()

        return new_user.to_json()
    #END OF TOURIST SPOT MANAGEMENT FUNCTIONS

    """
    EVENT MANAGEMENT FUNCTIONS
    1. get_all_events: Returns a list of all events in JSON format.
    2. get_event_by_id: Returns a event by its ID in JSON
    3. save_e: saves the event id to the user's personal_list and returns user
    """
    def get_all_events(self, user_id=None):
        all_events = [event.to_json() for event in self._session.execute(select(Event)).scalars().all()]
        user = self._session.execute(select(User).where(User.user_id == user_id)).scalar_one_or_none() if user_id else None

        if user:
            recommend = []
            for event in all_events:
                for tag in event['interest_tags']:
                    if tag in user.interest_tags:
                        recommend.append(event)
                        break
            return recommend

        return all_events
    
    def get_event_by_id(self, event_id):
        event = self._session.execute(select(Event).where(Event.event_id == event_id)).scalar_one_or_none()
        if event:
            return event.to_json()
        raise ValueError("Event not found")

    def save_e(self, user_id, event_id):
        user = self._session.execute(select(User).where(User.user_id == user_id)).scalar_one_or_none()
        event = self._session.execute(select(Event).where(Event.event_id == event_id)).scalar_one_or_none()

        if not event:
            raise ValueError('Event not found')
        if not user:
            raise ValueError('User not found')

        #I DONT KNOW WHY THIS WORKS
        personal_list = user.personal_list
        personal_list.append(event.event_id)

        new_user = User.from_json({
            "user_id": user.user_id,
            "username": user.username,
            "password": user.password,
            "interest_tags": user.interest_tags,
            "survey": user.survey,
            "travel_history": user.travel_history,
            "personal_list": personal_list
        })
        self._session.delete(user)
        self._session.add(new_user)
        #AAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHH

        self._session.commit()

        return new_user.to_json()
    #END OF EVENT MANAGEMENT FUNCTIONS

    def get_all(self):
        #return all spots and events as one list
        all_objects = []
        all_objects.extend(self.get_all_spots())
        all_objects.extend(self.get_all_events())
        return all_objects

    
# if __name__ == "__main__":
#     db = DatabaseManager()

    # with open("testdata/data.json", "r") as file:
    #     data = json.load(file)

    # for user_data in data.get("users", []):
    #     user = User.from_json(user_data)
    #     db._session.add(user)
    
    # db._session.commit()

#     #printing all users
    # users = db._session.execute(select(User)).scalars().all()
    # for user in users:
    #     print(user.to_json())
