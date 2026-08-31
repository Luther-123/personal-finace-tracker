from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Finance Tracker API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLAlchemy Database Model
class TransactionModel(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    amount = Column(Float)
    type = Column(String)
    date = Column(String)

# Pydantic Schemas
class TransactionCreate(BaseModel):
    title: str
    amount: float
    type: str
    date: str

class TransactionResponse(TransactionCreate):
    id: int

    class Config:
        orm_mode = True

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/transactions", response_model=List[TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(TransactionModel).all()

@app.post("/api/transactions", response_model=TransactionResponse)
def add_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = TransactionModel(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction