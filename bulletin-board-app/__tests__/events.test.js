/**
 * Unit Test: events data module
 * Pattern: Arrange-Act-Assert (AAA)
 *
 * Each test follows the three-phase AAA structure:
 *   Arrange – set up preconditions and inputs
 *   Act     – execute the unit under test
 *   Assert  – verify the expected outcome
 *
 * Contributed by: Josue Raudales
 */

const events = require("../backend/events");

describe("Events data module (AAA Pattern)", () => {
  test("should export a non-empty array of events", () => {
    // Arrange – nothing extra needed; the module is already loaded

    // Act
    const result = events;

    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("every event should have an id, title, and date", () => {
    // Arrange
    const requiredKeys = ["id", "title", "date"];

    // Act & Assert
    events.forEach((event) => {
      requiredKeys.forEach((key) => {
        expect(event).toHaveProperty(key);
      });
    });
  });

  test("every event id should be a unique number", () => {
    // Arrange
    const ids = events.map((e) => e.id);

    // Act
    const uniqueIds = new Set(ids);

    // Assert
    expect(uniqueIds.size).toBe(ids.length);
    ids.forEach((id) => {
      expect(typeof id).toBe("number");
    });
  });

  test("event dates should be valid ISO-format strings (YYYY-MM-DD)", () => {
    // Arrange
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

    // Act & Assert
    events.forEach((event) => {
      expect(event.date).toMatch(isoDateRegex);
      expect(isNaN(Date.parse(event.date))).toBe(false);
    });
  });
});
