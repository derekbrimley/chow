/*jslint
browser
*/
/*global
jquery, $
*/
/*property
    ajax, beforeSend, data, each, error, extendedIngredients, focus, forEach,
    hide, html, id, image, indexOf, log, name, prop, push, setRequestHeader,
    show, sourceUrl, splice, submit, success, text, title, url, val
*/

$(function () {
    'use strict';
    $("#ingredient_form").submit(function () {
        return false;
    });
    $('#ingredient_input').focus();
    $("#recipe_container").hide();
    $("#recipe_info_container").hide();
});

var ingredients = [];

var showIngredients = function (ingredients) {
    'use strict';
    var html = '';

    ingredients.forEach(function (ingredient) {
        html += '<li id="' + ingredient + '_div" class="ingredient_item"><span class="ingredient_name">' + ingredient + '</span><span class="delete_btn" onClick="deleteIngredient(\'' + ingredient + '\')"><img class="delete_img" src="images/close-box.png"/></span></li>';
    });

    $('#ingredient_list').html(html);
};

var addIngredient = function () {
    'use strict';
    var newIngredient = $('#ingredient_input').val();
    if (newIngredient !== '' && ingredients.indexOf(newIngredient) === -1) {
        ingredients.push(newIngredient);
        showIngredients(ingredients);
        $('#find_recipes_btn').prop('disabled', false);
        $('#ingredient_input').val('');
    }
};

var deleteIngredient = function (ingredient) {
    'use strict';
    var index = ingredients.indexOf(ingredient);
    console.log(index);

    if (index > -1) {
        ingredients.splice(index, 1);
    }
    showIngredients(ingredients);
};

var showRecipes = function (recipes) {
    'use strict';

    var html = '';
    recipes.forEach(function (recipe) {
        html += '<div class="recipe" onClick="openRecipe(' + recipe.id + ')">';
        html += '<img title="Click for recipe info" class="recipe_img" src="' + recipe.image + '"/>';
        html += '<div class="recipe_title">' + recipe.title + '</div>';
        html += '</div>';
    });

    $('#recipe_list').html(html);
    $('#ingredient_container').hide();
    $('#recipe_container').show();
};

var findRecipes = function () {
    'use strict';
    ingredients = [];

    $('.ingredient_item').each(function (item) {
        ingredients.push($(this).text());
    });

    var list = '';
    ingredients.forEach(function (item) {
        list += item + '%2C';
    });

    var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients=' + list + '&limitLicense=false&number=20&ranking=';

    var type = $('#query_type').val();
	console.log(type);
    url += type;

    console.log(url);

    $.ajax({
        url: url,
        data: {},
        success: function (data) {
            showRecipes(data);
            console.log(data);
        },
        error: function (err) {
            alert(err);
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", "DGNAwDSl06mshutpm0u9Z5fJLSkip18dIGRjsnZmB84UOW80ow");
        }
    });
};

var openRecipe = function (id) {
    'use strict';

    var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/' + id + '/information';

    $.ajax({
        url: url,
        data: {},
        success: function (data) {
            console.log(data);
            var recipeIngredients = data.extendedIngredients;

            var html = '';
            html += '<div class="recipe_title">' + data.title + '</div>';
            html += '<a title="Click to go to recipe" target="_blank" href="' + data.sourceUrl + '"><img class="recipe_img" src="' + data.image + '"/></a>';
			html += '<a class="pin_btn" data-pin-do="buttonPin" data-pin-color="red" data-pin-count="above" data-pin-tall="true" target="_blank" href="https://www.pinterest.com/pin/create/button/' + 
				'?url=' + encodeURIComponent(data.sourceUrl) + 
				'&media=' + encodeURIComponent(data.image) + 
				'&description=' + encodeURIComponent(data.title) + '"><img src="//assets.pinterest.com/images/pidgets/pinit_fg_en_rect_red_28.png" /></a>';
            html += '<div class="ingredient_list">';
            html += '<h2>Ingredients</h2>';
            recipeIngredients.forEach(function (ingredient) {
                html += '<div class="ingredient">' + ingredient.name + '</div>';
            });
            html += '</div>';
			html += '<div>';
			
			html += '</div>';
            $('#recipe_info').html(html);

            $('#recipe_container').hide();
            $('#recipe_info_container').show();
        },
        error: function (err) {
            alert(err);
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", "DGNAwDSl06mshutpm0u9Z5fJLSkip18dIGRjsnZmB84UOW80ow");
        }
    });
};

var toIngredients = function () {
    'use strict';

    $("#recipe_container").hide();
    $("#recipe_info_container").hide();
    $("#ingredient_container").show();
};

var toRecipes = function () {
    'use strict';

    $("#recipe_info_container").hide();
    $("#ingredient_container").hide();
    $("#recipe_container").show();
};
