Feature: Run a table tennis league

	Scenario: empty league
		Given the league has no players
		When I print the league
		Then I should see that there are no players

	Scenario: Adding players
		Given the league has no players
		When I add the player "Alice"
		And I add the player "Bob"
		Then I should see the player "Alice"
		And I should see the player "Bob"
