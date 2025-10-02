package storage

import (
	"errors"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/config"
)

type Store struct {
	db *gorm.DB
}

type Task struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	UserID    string    `json:"user_id" gorm:"index"`
	Text      string    `json:"text"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"created_at"`
}

func Init(cfg *config.Config) error {
	dbPath := filepath.Join(".", "todos.db")
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return err
	}

	// Auto-migrate the schema
	if err := db.AutoMigrate(&Task{}); err != nil {
		return err
	}

	defaultStore = &Store{db: db}
	return nil
}

var defaultStore *Store

func Get() *Store { return defaultStore }

func (s *Store) List(userID string) ([]Task, error) {
	var tasks []Task
	err := s.db.Where("user_id = ?", userID).Order("completed ASC, id ASC").Find(&tasks).Error
	return tasks, err
}

func (s *Store) GetByID(userID, id string) (*Task, error) {
	var task Task
	err := s.db.Where("id = ? AND user_id = ?", id, userID).First(&task).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &task, err
}

func (s *Store) Add(userID, text string) ([]Task, error) {
	task := Task{
		ID:        uuid.New().String(),
		UserID:    userID,
		Text:      text,
		Completed: false,
		CreatedAt: time.Now(),
	}

	if err := s.db.Create(&task).Error; err != nil {
		return nil, err
	}

	return s.List(userID)
}

func (s *Store) Delete(userID, id string) ([]Task, error) {
	if err := s.db.Where("id = ? AND user_id = ?", id, userID).Delete(&Task{}).Error; err != nil {
		return nil, err
	}
	return s.List(userID)
}

func (s *Store) MarkCompleted(userID, id string) ([]Task, error) {
	if err := s.db.Model(&Task{}).Where("id = ? AND user_id = ?", id, userID).Update("completed", true).Error; err != nil {
		return nil, err
	}
	return s.List(userID)
}
