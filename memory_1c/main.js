$(document).ready(function() {
	highscore = localStorage.getItem('highScore')
	if(highscore == null || highscore == undefined){
		localStorage.setItem("highScore", 0)
	}
	$("#high_score").text("High score: "+ highscore + "%")
});

const imageArray = [
	"card_1.png",
	"card_2.png",
	"card_3.png",
	"card_4.png",
	"card_5.png",
	"card_6.png",
	"card_7.png",
	"card_8.png",
	"card_9.png",
	"card_10.png",
	"card_11.png",
	"card_12.png",
	"card_13.png",
	"card_14.png",
	"card_15.png",
	"card_16.png",
	"card_17.png",
	"card_18.png",
	"card_19.png",
	"card_20.png",
	"card_21.png",
	"card_22.png",
	"card_23.png",
	"card_24.png",
];

function CreateCard(selectedCard) {
	var button = $("<a>");
	button.attr("id", selectedCard);
	button.addClass("button");
	button.css({
		margin: "3px",
	});

	var cardBackImage = $("<img>");
	cardBackImage.attr("src", "images\\back.png");
	cardBackImage.css({
		width: "75px",
		height: "90px",
	});

	var cardImage = $("<img>");
	cardImage.attr("src", "images\\" + selectedCard);
	cardImage.css({
		width: "75px",
		height: "90px",
	});

	var cardBlankImage = $("<img>");
	cardBlankImage.attr("src", "images\\blank.png");
	cardBlankImage.css({
		width: "75px",
		height: "90px",
	});

	cardBlankImage.hide();
	cardImage.hide();

	cardBackImage.appendTo(button);
	cardImage.appendTo(button);
	cardBlankImage.appendTo(button);

	button.appendTo("#tabs-1");
}

function highScoreHandler(score){
	if(localStorage.getItem("highScore") < score){
		localStorage.setItem("highScore",score);
		$("#high_score").text("High score: "+currentPerc + "%");
	}
}

function HandleCardsMatch(buttons) {
	for (const button of buttons) {
		// Get and swap images on selected buttons
		const buttonImages = $(button).find("img");
		//buttonImages.eq(1).hide();
		//buttonImages.eq(2).show();
		setTimeout(() => {

			$(buttonImages.eq(1)).fadeOut(1000, function() {
				// Fade in the new image once the fade out is complete
				buttonImages.eq(2).fadeIn(2000);
			});
			
			},2000);

		// Disable card
		$(button).prop("disabled", true);
	}
}

function HandleCardsMismatch(selectedCards) {
	console.log(selectedCards)

	const images1 = selectedCards[0].find("img");
	const images2 = selectedCards[1].find("img");
	setTimeout(() => {

	$(images1.eq(1)).fadeOut(1000, function() {
		// Fade in the new image once the fade out is complete
		images1.eq(0).fadeIn(2000);
	});
	$(images2.eq(1)).fadeOut(1000, function() {
		// Fade in the new image once the fade out is complete
		images2.eq(0).fadeIn(2000);
	});
	},2000);

	// Show the back image
	//images1.eq(0).show();
	//images2.eq(0).show();

	// Hide the actual card image
	//images1.eq(1).hide();
	//images2.eq(1).hide();

	selectedCards[0].prop("disabled", false);
	selectedCards[1].prop("disabled", false);
}

// Document ready
$(function () {

	// Set tabs div as tabs
	$("#tabs").tabs();

	// Register onclick event whenever settings are saved
	$("#save_settings").click(function () {
		const playerName = $("#player_name").val();

		// Set player name and clear input field
		$("#player").text(playerName);
		$("#player_name").val("");

		// Clear cards from previous session (if valid)
		$("#tabs-1").find("a").remove();

		numberCards = $("#num_cards").val();
		let randomNumber = -1;
		let selectedImageArry = [];

		// Randomize cards
		const imagesArrayCopy = imageArray.slice();
		const endIndex = numberCards / 2;
		for (let i = 0; i < endIndex; i++) {
			randomNumber = Math.floor(Math.random() * imagesArrayCopy.length);
			let selectedCard = imagesArrayCopy[randomNumber];
			selectedImageArry.push(selectedCard);
			imagesArrayCopy.splice(randomNumber, 1);
		}

		console.log(selectedImageArry);
		let cardCheck = [];
		for (let i = 0; i < numberCards; i++) {
			randomNumber = Math.floor(Math.random() * selectedImageArry.length);
			selectedCard = selectedImageArry[randomNumber];
			if (cardCheck.includes(selectedCard)) {
				cardCheck.push(selectedCard);
				selectedImageArry.splice(randomNumber, 1);
			} else {
				cardCheck.push(selectedCard);
			}

			CreateCard(selectedCard);
		}
	});
	let attempts = 0;
	let correct = 0;
	let isMatching = false;
	let compareArray = [];
	$("#tabs-1").on("click", "a", function () {

		if (isMatching)
			return;

		const currentButton = $(this);
		const buttonId = currentButton.attr("id");
		const images = currentButton.find("img");

		// Reveal card and add to compare array
		//images.eq(0).hide();
		//images.eq(1).show();

			
				$(images.eq(0)).fadeOut(1000, function() {
					// Fade in the new image once the fade out is complete
					$(images.eq(1)).fadeIn(1000);
			});
			
	
	

		currentButton.prop("disabled", true);
		compareArray.push(currentButton);

		if (compareArray.length < 2) 
			return;

		isMatching = true;
		if (compareArray[0].attr("id") == buttonId) {
			// Get both selected buttons
			correct+=1
			attempts+=1
			$("#correct").text("Correct: "+Math.floor(((correct/attempts)*100)) +"%");
			const selectedButtons = document.querySelectorAll(`[id='${buttonId}']`);
			
			console.log("Matched!");
			setTimeout(() => {
				// Run logic to handle when cards match
				HandleCardsMatch(selectedButtons);

				// Clear compare array
				compareArray = [];

				isMatching = false;
			}, 1000);

		} else {
			console.log("Mismatched!");
			attempts+=1
			$("#correct").text("Correct: "+Math.floor(((correct/attempts)*100)) +"%");
			setTimeout(() => {
				// Run logic to handle when the cards do not match
				HandleCardsMismatch(compareArray);

				// Clear compare array
				compareArray = [];

				isMatching = false;
			}, 1000);
		}

		if(correct == numberCards/2){
			currentPerc = Math.floor((correct/attempts)*100)
			highScoreHandler(currentPerc)

			
		}

	});
});
