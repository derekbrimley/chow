
$(function () {
	'use strict';
	$("#ingredient_form").submit(function (e) {
		return false;
	});
	$('#ingredient_input').focus();
});

var ingredients = [];

function addIngredient() {
	var newIngredient = $('#ingredient_input').val();
	if(newIngredient != '' && ingredients.indexOf(newIngredient) == -1){
		ingredients.push(newIngredient);
		showIngredients(ingredients);
		$('#find_recipes_btn').prop('disabled', false);
		
		$('#ingredient_input').val('');
	}else{
		console.log(newIngredient);
	}
}

function showIngredients(ingredients){
	var html = '';
	
	ingredients.forEach(function(ingredient){
		html += '<li id="'+ingredient+'_div" class="ingredient_item"><span class="ingredient_name">'+ingredient+'</span><span class="delete_btn" onClick="deleteIngredient(\''+ingredient+'\')"><img class="delete_img" src="images/close-box.png"/></span></li>';
	});
	
	$('#ingredient_list').html(html);
}

function deleteIngredient(ingredient){
	var index =	ingredients.indexOf(ingredient);
	console.log(index);
	
	if (index > -1) {
		ingredients.splice(index, 1);
	}
	showIngredients(ingredients);
}

function findRecipes(){

	var ingredients = [];
	
	$('.ingredient_item').each(function(item){
		ingredients.push($( this ).text());
	});
	
	var list = '';
	ingredients.forEach(function(item){
		list += item+'%2C';
	});
	
	var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients='+list+'&limitLicense=false&number=5&ranking=2';
	
	console.log(url);
	
	var output = $.ajax({
		url: url,
		data: {},
		success: function(data) { 
			showRecipes(data);
			console.log(data);
		},
		error: function(err) { alert(err); },
		beforeSend: function(xhr) {
			xhr.setRequestHeader("X-Mashape-Authorization", "DGNAwDSl06mshutpm0u9Z5fJLSkip18dIGRjsnZmB84UOW80ow");
		}
	});
}

function showRecipes(recipes){
	console.log("here");
	var html = '';
	recipes.forEach(function(recipe){
		html += '<div class="recipe" onClick="openRecipe('+recipe.id+')">';
		html += '<img class="recipe_img" src="'+recipe.image+'"/>'
		html +=	'<div class="recipe_title">'+recipe.title+'</div>';
		html += '</div>';
	});
	
	$('#recipe_list').html(html);
	$('#ingredient_container').hide();
	$('#recipe_container').show();
}

function openRecipe(id){
	console.log(id);
	
	var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'+id+'/information';
	
	$.ajax({
		url: url,
		data: {},
		success: function(data) { 
			console.log(data);
			var ingredients = data.extendedIngredients;
			
			var html = '';
			html += '<div class="recipe_title">'+data.title+'</div>';
			html += '<a target="_blank" href="'+data.sourceUrl+'"><img class="recipe_img" src="'+data.image+'"/></a>';
			html += '<div class="ingredient_list">';
			html += '<h2>Ingredients</h2>';
			ingredients.forEach(function(ingredient){
				html += '<div class="ingredient">'+ingredient.name+'</div>'
			});
			html += '</div>';
			$('#recipe_info').html(html);
			
			$('#recipe_container').hide();
			$('#recipe_info').show();
		},
		error: function(err) { alert(err); },
		beforeSend: function(xhr) {
			xhr.setRequestHeader("X-Mashape-Authorization", "DGNAwDSl06mshutpm0u9Z5fJLSkip18dIGRjsnZmB84UOW80ow");
		}
	});
}

function toIngredients(){
	$("#recipe_container").hide();
	$("#ingredient_container").show();
}