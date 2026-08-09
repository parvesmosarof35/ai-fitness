package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type rateLimitEntry struct {
	count     int
	expiresAt time.Time
}

var rateLimiter sync.Map

// RateLimit is a simple in-memory rate limiter for local development
func RateLimit(requests int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		now := time.Now()

		entry, _ := rateLimiter.LoadOrStore(ip, &rateLimitEntry{
			count:     0,
			expiresAt: now.Add(window),
		})
		
		rlEntry := entry.(*rateLimitEntry)

		// Reset if expired
		if now.After(rlEntry.expiresAt) {
			rlEntry.count = 0
			rlEntry.expiresAt = now.Add(window)
		}

		rlEntry.count++

		if rlEntry.count > requests {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "too many requests"})
			c.Abort()
			return
		}

		c.Next()
	}
}
