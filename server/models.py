from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, relationship
from sqlalchemy.types import JSON
from uuid import uuid4, UUID


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = 'users'
    
    user_id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    username: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    interest_tags: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=True)
    travel_history: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=True)
    personal_list: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=True)
    friends: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=True)
    survey: Mapped[list[int]] = mapped_column(JSON, default=list, nullable=True)
    
    def to_json(self):
        return{
            "user_id": self.user_id,
            "username": self.username,
            "password": self.password,
            "interest_tags": self.interest_tags,
            "travel_history": self.travel_history,
            "personal_list": self.personal_list,
            "friends": self.friends,
            "survey": self.survey
        }
    
    def from_json(data):
        return User(
            user_id=data.get("user_id"),
            username=data.get("username"),
            password=data.get("password"),
            interest_tags=data.get("interest_tags", []),
            travel_history=data.get("travel_history", []),
            personal_list=data.get("personal_list", []),
            friends=data.get("friends", []),
            survey=data.get("survey", [])
        )


class TouristSpot(Base):
    __tablename__ = 'tourist_spots'
    
    spot_id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    description: Mapped[str] = mapped_column(nullable=True)
    coordinates: Mapped[list[float]] = mapped_column(JSON)
    interest_tags: Mapped[list[str]] = mapped_column(JSON)
    price_of_entry: Mapped[JSON] = mapped_column(JSON, nullable=True)
    pictures: Mapped[list[str]] = mapped_column(JSON)
    open_hours: Mapped[JSON] = mapped_column(JSON, nullable=True)
    accessibility: Mapped[JSON] = mapped_column(JSON, nullable=True)
    general_advice: Mapped[str]

    def to_json(self):
        return {
            "spot_id": self.spot_id,
            "name": self.name,
            "description": self.description,
            "coordinates": self.coordinates,
            "interest_tags": self.interest_tags,
            "price_of_entry": self.price_of_entry,
            "pictures": self.pictures,
            "open_hours": self.open_hours,
            "accessibility": self.accessibility,
            "general_advice": self.general_advice
        }
    
    def from_json(data):
        return TouristSpot(
            spot_id=data.get("spot_id"),
            name=data.get("name"),
            description=data.get("description", ""),
            coordinates=data.get("coordinates"),
            interest_tags=data.get("interest_tags"),
            price_of_entry=data.get("price_of_entry"),
            pictures=data.get("pictures"),
            open_hours=data.get("open_hours"),
            accessibility=data.get("accessibility"),
            general_advice=data.get("general_advice")
        )

class Event(Base):
    __tablename__ = 'events'
    
    event_id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    interest_tags: Mapped[list[str]] = mapped_column(JSON)
    image_url: Mapped[str] = mapped_column(nullable=True)
    url: Mapped[str] = mapped_column(nullable=True)
    description: Mapped[str] = mapped_column(nullable=True)
    datetime: Mapped[str] = mapped_column(nullable=True)
    location: Mapped[str] = mapped_column(nullable=True)

    def to_json(self):
        return {
            "event_id": self.event_id,
            "name": self.name,
            "interest_tags": self.interest_tags,
            "image_url": self.image_url,
            "url": self.url,
            "description": self.description,
            "datetime": self.datetime,
            "location": self.location
        }
    
    def from_json(data):
        return Event(
            event_id=data.get("id"),
            name=data.get("name"),
            interest_tags=data.get("category", []),
            image_url=data.get("image_url", ""),
            url=data.get("url", ""),
            description=data.get("description", ""),
            datetime=data.get("datetime", ""),
            location=data.get("location", "")
        )