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

	Scenario: Recording wins
		Given the league has the player "Alice"
		And the league has the player "Bob"
		When I record "Bob" winning against "Alice"
		Then the game's winner should be "Bob"

	Scenario: Saving the game
		Given the league has the player "Alice"
		And the league has the player "Bob"
		When I save to the file "some/path.json"
		Then the league is written to "some/path.json"

	Scenario: Loading a game
		Given the league has no players
		And the file "some/path.json" contains '[["Alice"], ["Bob"]]'
		When I load the file "some/path.json"
		Then I should see the player "Alice"
		And I should see the player "Bob"
		And the game's winner should be "Alice"
