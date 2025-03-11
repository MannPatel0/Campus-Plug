package main

import (
	"fmt"
	"math"
)

func cosine(x, y []int) float64 {
	var dotProduct, normX, normY float64
	for i := 1; i < len(x); i++ {
		dotProduct += float64(x[i] * y[i])
		normX += float64(x[i] * x[i])
		normY += float64(y[i] * y[i])
	}
	return dotProduct / (math.Sqrt(normX) * math.Sqrt(normY))
}

func main() {
	history := [][]int{
		{1, 0, 1, 0},
		{0, 1, 0, 1},
		{1, 0, 1, 1},
	}

	productCategory := [][]int{
		{1, 1, 0, 0},
		{0, 0, 0, 1},
		{0, 0, 1, 0},
		{0, 0, 1, 1},
		{0, 1, 0, 0},

		{0, 1, 1, 1},
		{1, 1, 1, 0},
		{0, 0, 0, 1},
		{1, 1, 1, 1},
	}

	// Calculate similarity between first search and each product
	for i, product := range productCategory {
		sim := cosine(history[0], product)
		fmt.Printf("Similarity with product %d: %f\n", i, sim)
	}
}
