
			$("#id_country").change(function(){	
				search_regions()
			});
				function search_regions() {
					var id = $("#id_country").val();

					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/search_regions/" + id + "/",
						dataType: "json",
						success: function(json)
						{
					
							console.log("success");
						
							$('select#id_region').html('')
							var options = '<option value="">Не выбрано</option>';
							$('select#id_region').append(options)
							var region = json
			
							$.each(region, function(key, value){
							$('select#id_region').append('<option value="' + key + '">' + value +'</option>');

							$('.chosen-select').trigger("chosen:updated");	
							})
						} 

			});
				};

			$("#id_region").change(function(){	
			search_cities()
			});
				function search_cities(){
					var id = $("#id_region").val();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/search_cities/" + id + "/",
						dataType: "json",
						success: function(json)
						{					
							console.log("success");						
							$('select#id_city').html('')
							var options = '<option value="">---------</option>';
							$('select#id_city').append(options)
							var city = json
							$.each(city, function(key, value){
							$('select#id_city').append('<option value="' + key + '">' + value +'</option>');
							})
							
							/*$(".select-city").html(function(){ return data});
							$(".select-city").trigger("chosen:updated");*/
						
							$('.chosen-select').trigger("chosen:updated");	
							
						} 

			});
				};
				
				$("#arch_filters").click(function(){			
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/load_filters/",
						dataType: "json",
						success: function(json)
						{
					
							console.log("filters are load");
						
							$('select#load_filter_select').html('')
							var options = '<option value="">Выберите фильтр для загрузки</option>';
							$('select#load_filter_select').append(options)
							var filter = json
			
							$.each(filter, function(key, value){
							$('select#load_filter_select').append('<option value="' + key + '">' + value +'</option>');
							})
						} 

			});
				});
				
				$("#save_filters").click(function(){			
					var data = $('form#save_filtrs_form').serialize(); 
					var data2 = $('form#filters_form').serialize(); 
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/save_filters/",
						data : {data:data,data2:data2},
						dataType: "json",
						success: function(json)
						{
					if (json.blank_error){
						alert(json.blank_error)
					}		
					else {
							console.log("filres are safe");
							alert('Фильтр успешно сохранён');
							$('#save_filter_name').val('');
							$('#arch_filters_form').css("display", "none");
						} 
					}
			});
				});

				$("#delete_filter").click(function(){			
					var id = $('#load_filter_select').val(); 
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/delete_filter/" + id + "/",
						dataType: "json",
						success: function(json)
						{
					
							console.log("filter is deleted");
							alert('Фильтр удален');
							$( "#load_filter_select option:selected" ).remove();
							$('#save_filter_name').val('');
							$('#arch_filters_form').css("display", "none");
						} 

			});
				});
				
				function save_comment(id){			
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/add_comment/",
						data : {comment_data: $('#new_comment'+id+'').val(), },
						dataType: "json",
						success: function(json)
						{
					
							console.log("add comment");
							$('#comment_list'+id+'').html(json.comment_list);
							$('#new_comment'+id+'').val('');
							$('.comment_block').hide();
							var count = $('#comment_count').text();
							var new_count = parseInt(count)+1;
							$('#comment_count').text(new_count);
						} 

			});
				};

			$("#save_oso_comments").click(function(){			
					var id = $('#org_id').text();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/add_oso_comment/",
						data : {comment_data: $('#new_oso_comment').val(), },
						dataType: "json",
						success: function(json)
						{
					
							console.log("add oso comment");
							$('#oso_comments_list').html(json.comment_list);
							$('#new_oso_comment').val('');
							$('#oso_comments_block').hide();
							var count = $('#oso_comments_count').text();
							var new_count = parseInt(count)+1;
							$('#oso_comments_count').text(new_count);
						} 

			});
				});
				
			$("#save_admin_comments").click(function(){			
					var id = $('#org_id').text();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/add_admin_comment/",
						data : {comment_data: $('#new_admin_comment').val(), },
						dataType: "json",
						success: function(json)
						{
					
							console.log("add admin comment");
							$('#admin_comments_list').html(json.comment_list);
							$('#new_admin_comment').val('');
							$('#admin_comments_block').hide();
						} 

			});
				});
				
				$(".change_user").change(function(){			
					var id = $(this).parent('td').parent('tr').attr('id');
					var user_id = $(this).val(); 
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/change_user/"+ user_id + "/",
						dataType: "json",
						success: function(json)
						{
					
							console.log("user is chande");
							
						} 

			});
				});

				$(".change_vazhnost").change(function(){			
					var id = $(this).parent('td').parent('tr').attr('id');
					var vazhnost = $(this).val(); 
					$('#interest_org_id').val(id);
					$('#cause_org_id').val(id);
					
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/change_vazhnost/"+ vazhnost + "/",
						dataType: "json",
						success: function(json)
						{
					
							console.log("vazhnost is change");
							if (json.message) {
								$('#vazhnost_message').text(json.message);
								
								$('#form_errors').modal('show');	
							}
							else if (json.vazhnost_message) {
								if (json.vazhnost_message  == 'interests') {
									$('#add_interest').modal('show');
									$('#interest_form')[0].reset();
									if (json.interest_list){
									for (var i = 0; i < json.interest_list.count; i++) {							
										$("select#interest_choice option[value=" + i + "]").attr('selected', 'true');
										
									}
									}
									if (json.dop_interest) {
										$('#id_interest-dop_interest').val(json.dop_interest);
									}
								}
								if (json.vazhnost_message  == 'trash') {
									$('#add_trash_cause').modal('show');
									$('#cause_form')[0].reset();
									if (json.cause_list){
									for (var i = 0; i < json.cause_list.count; i++) {							
										$("select#cause_choice option[value=" + i + "]").attr('selected', 'true');
										
									}
									}
									if (json.dop_cause) {
										$('#id_trash-dop_cause').val(json.dop_cause);
									}
								}								
							}
							
						} 

			});
				});
				

				
				$(".change_date").click(function(){			
					var id = $(this).attr('id');
					var date = $('#id_date'+id+'').val(); 
					
					$.ajax
					({
						type : "POST",
						cache: false,
						data : {date:date,},
						url: "/organizations/" + id + "/change_date/",
						dataType: "json",
						success: function(json)
						{
							console.log("date is changed");

							alert('Дата контакта успешно изменена')
						} 

			});
				});
				

				
				$(".change_sr_date").click(function(){			
					var id = $(this).attr('id');
					var date = $('#id_date'+id+'').val(); 
					$.ajax
					({
						type : "POST",
						cache: false,
						data : {date:date,},
						url: "/srs/" + id + "/change_sr_date/",
						dataType: "json",
						success: function(json)
						{
							console.log("date is changed");
							alert('Дата контакта успешно изменена')
						} 

			});
				});

				$(".save_bill").click(function(){			
					var id = $('#org_id').text();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/add_bill/",
						data : {bill_number: $('#bill_number').val(), bill_summ: $('#bill_summ').val(), bill_user: $('#bill_user').val(),
						bill_paydate: $('#bill_paydate').val(), bill_tarif: $('#bill_tarif').val(),},
						dataType: "json",
						success: function(json)
						{
						if (json.blank_error){
							alert(json.blank_error)
						}		
						else {					
							console.log("add bill");
							$('#bill_list').html(json.bill_list);
							$('#bill_number').val('');
							$('#bill_summ').val('');
							$('#bill_paydate').val('');
							$('#bill_tarif').val('');
							$('.bill_block').hide();
						} 
						} 
			});
				});
				
				$("#save_z").click(function(){			
					var id = $('#org_id').text();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/add_z/",
						data : {z_lot_number: $('#z_lot_number').val(), z_lot_ss: $('#z_lot_ss').val(), z_podacha_date: $('#z_podacha_date').val(),
						z_auction_date: $('#z_auction_date').val(),},
						dataType: "json",
						success: function(json)
						{
						if (json.blank_error){
							alert(json.blank_error)
						}		
						else {					
							console.log("add bill");
							$('#z_table tbody').append('<tr id="zayavka' + json.id + '"><td><span id="pole_lot_number'+json.id+'">' + json.lot_number +'</span></td>'+'<td><span id="pole_lot_ss'+json.id+'">' + json.lot_ss +'</span></td>'+'<td><span id="pole_podacha_date'+json.id+'">' + json.podacha_date +'</span> <input type="checkbox" class="podacha_date"></td>'+'<td><span id="pole_auction_date'+json.id+'">' + json.auction_date +'</span> <input type="checkbox" class="auction_date"></td>');
							$('#z_block').hide();
							$('#z_form .input').val('');
						} 
						} 
			});
				});
				
				$("#save_rekvizits").click(function(){						
					var data = $('form#rekvizits_form').serialize();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/save_rekvizits/",
						data : {data: data,},
						dataType: "json",
						success: function(json)
						{
						if (json.blank_error){
							alert(json.blank_error)
						}		
						else {					
							console.log("rekvizits are saved");
							alert("Реквизиты сохранены")
							$('#rekvizits_block').hide();
						} 
						} 
			});
				});
				

				$("#save_remember").click(function(){			
					var id = $('#org_id').text();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/save_remember/",
						data : {remember_text: $('#remember_text').val(), remember_date: $('#remember_date').val(),},
						dataType: "json",
						success: function(json)
						{
						if (json.blank_error){
							alert(json.blank_error)
						}		
						else {					
							console.log("add remember");
							$('.modal').modal('hide');
							$('#remember_text').val('');
							$('#remember_date').val('');
							alert("Напоминание создано");
						} 
						} 
			});
				});
				
				$("#save_ecp").click(function(){			
					var id = $('#org_id').text();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/add_ecp_date/",
						data : {ecp_date: $('#ecp_date').val(), },
						dataType: "json",
						success: function(json)
						{
					
							console.log("add ecp date");
						} 

			});
				});


				$("#save_ecp_area").click(function(){			
					var id = $('#org_id').text();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/add_ecp_area/",
						data : {area_date: $('#area_date').val(), area_name: $('#area').val(),},
						dataType: "json",
						success: function(json)
						{
					
							console.log("add ecp area");
							$('#area_list').html(json.area_list);
							$('#area').val('');
							$('#area_date').val('');
							$('#ecp_block').hide();
						} 

			});
				});

				$("#save_dolzhnost").click(function(){			
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/add_dolzhnost/",
						data : {new_dolzhnost: $('#dolzhnost_text').val(),},
						dataType: "json",
						success: function(json)
						{
						if (json.blank_error){
							alert(json.blank_error)
						}		
						else {					
							console.log("dolzhnost is saved");
						
							$('select#id_form2-dolzhnost').html('')
							var options = '<option value="">---------</</option>';
							$('select#id_form2-dolzhnost').append(options)
							var filter = json
			
							$.each(filter, function(key, value){
							$('select#id_form2-dolzhnost').append('<option value="' + key + '">' + value +'</option>');
							})
							$('.modal').modal('hide');
							$('#dolzhnost_text').val('');
							alert("Должность успешно добавлена!");
						}; 
						} 
			});
				});

				$("#save_city").click(function(){			
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/add_city/",
						data : {new_city: $('#city_text').val(), new_region: $('#id_region').val(),},
						dataType: "json",
						success: function(json)
						{
						if (json.blank_error){
							alert(json.blank_error)
						}		
						else {					
							console.log("city is saved");
						
							$('select#id_city').html('')
							var options = '<option value="">---------</</option>';
							$('select#id_city').append(options)
							var filter = json.city_dict
			
							$.each(filter, function(key, value){
							$('select#id_city').append('<option value="' + key + '">' + value +'</option>');
							})
							$('#newCity').modal('hide');
							$('#city_text').val('');
							

							if (json.city_is_used){
								alert(json.city_is_used)
								var region = json.region;
								$("select#id_region option[value=" + region + "]").attr('selected', 'true');
							}		
							else {					
								alert("Город успешно добавлен!");
							};
							var city = json.city;
							$("select#id_city option[value=" + city + "]").attr('selected', 'true');
							$('.chosen-select').trigger("chosen:updated");	
						}; 
						} 
			});
				});


	
			$("body").on('click','.edit',function () {			
					var id = $('#c_id').val();
	
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/change_org_contact/",
						dataType: "json",
						success: function(json)
						{
						$('#id_contact-name').val(json.name);
						$('#id_contact-dolzhnost').val(json.dolzhnost);
						$('#id_contact-comment').val(json.comment);
						
						$('#id_form-0-email').val('');						
						$('#id_form-0-DELETE').prop("checked", false);				
						
						$('#extra_form_set').html('');
						$('#id_form-TOTAL_FORMS').val(1);
						var email_count = json.ind;

						for (var i = 1; i < parseInt(email_count); i++) {
							var form_idx = $('#id_form-TOTAL_FORMS').val();
							$('#extra_form_set').append($('#empty_form').html().replace(/__prefix__/g, form_idx));
							$('#id_form-TOTAL_FORMS').val(parseInt(form_idx) + 1);
						}

										
						for (var i = 0; i < json.ind; i++) {							
							var email = eval('json.email'+i+'');
							$('#id_form-'+i+'-email').val(email);
						}

						
						$('#id_formset2-0-phone').val('');
						$('#id_formset2-0-DELETE').prop("checked", false);
							
						$('#extra_form_set2').html('');
						$('#id_formset2-TOTAL_FORMS').val(1);
						var phones_count = json.ind2;
						
							for (var i = 1; i < parseInt(phones_count); i++) {
								var form_idx = $('#id_formset2-TOTAL_FORMS').val();
								$('#extra_form_set2').append($('#empty_form2').html().replace(/__prefix__/g, form_idx));
								$('#id_formset2-TOTAL_FORMS').val(parseInt(form_idx) + 1);
							}
							

							for (var i = 0; i < json.ind2; i++) {								
								var phone = eval('json.phone'+i+'');
								$('#id_formset2-'+i+'-phone').val(phone);
							}
							
						} 

			});
				});
				
				$("#save_contact").click(function(){			
					var id = $('#org_id').text();
					var data = $('form#contactForm').serialize(); 
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/organizations/" + id + "/add_contact_aj/",
						data : {data: data,},
						dataType: "json",
						success: function(json)
						{
						if (json.blank_error){
							alert(json.blank_error)
						}		
						else {	
							console.log("add contact");
							if (json.new_contact) {
							$('#contacts tbody').append('<tr id="' + json.id + '"><td><span id="contact_name'+json.id+'">' + json.name +'</span></td>'+'<td><span id="contact_phones'+json.id+'">' + json.phone_list +'</span></td>'+'<td><span id="contact_emails'+json.id+'">' + json.email_list +'</span></td>'+'<td><span id="contact_dolzhnost'+json.id+'">' + json.dolzhnost +'</td>'+'<td><span id="contact_comment'+json.id+'">' + json.comment +'</span></td><td></td><td><a href="" data-toggle="modal" data-target="#add_contact" class="edit"><img src="/static/img/edit.png"/></a> <a href="javascript:if(confirm('+"'Подтвердите удаление')) delete_org_contact"+json.id+'()"><img src="/static/img/delete.png"></a></td><script type="text/javascript">function delete_org_contact'+json.id+'() {$("#'+json.id+'").load("/organizations/delete_org_contact/'+json.id+'/")}</script></tr>');
						
							}
							else {
								$('#contact_name'+json.id+'').html(json.name);
								$('#contact_dolzhnost'+json.id+'').html(json.dolzhnost);
								$('#contact_phones'+json.id+'').html(json.phone_list);
								$('#contact_emails'+json.id+'').html(json.email_list);
								$('#contact_comment'+json.id+'').html(json.comment);
							}
							
							$('.modal').modal('hide');
						};
						} 

			});
				});

			/*$("#id_form2-user_group").change(function(){	
				ruks_search();
				if ($(this).val() == 3) {
					$("#id_form2-dolzhnost option[value='11']").show();
				}
				else {
					$("#id_form2-dolzhnost option[value='11']").hide();
					$('#id_form2-dolzhnost').val('');	
				}
			});	*/		
			
			function ruks_search() {
					var group = $('#id_form2-user_group').val();
					var user = $('#user_id').val();
					var dolzhnost = $('#id_form2-dolzhnost').val();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/users/search_rukovoditels/",
						dataType: "json",
						data: {group:group, n_user:user, dolzhnost:dolzhnost,},
						success: function(json)
						{
					
							console.log("success");
						
							$('select#id_form2-rukovoditel').html('')
							if (json.count > 1){
							var options = '<option value="">Не выбрано</option>';
							$('select#id_form2-rukovoditel').append(options)}
							var us = json.users_dict
			
							$.each(us, function(key, value){
							$('select#id_form2-rukovoditel').append('<option value="' + key + '">' + value +'</option>');

							$('.chosen-select').trigger("chosen:updated");	
							})
						} 

			});
			};

			$(".sr_save_comment").click(function(){			
					var id = $('#sr_id').text();
			
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/sr/" + id + "/add_comment/",
						data : {comment_data: $('#new_comment'+id+'').val(), type:"2"},
						dataType: "json",
						success: function(json)
						{
					
							console.log("add comment");
							
							$('#comment_list'+id+'').html(json.comment_list);
							$('#new_comment'+id+'').val('');
							$('.comment_block').hide();
							var count = $('#comment_count').text();
							var new_count = parseInt(count)+1;
							$('#comment_count').text(new_count);
						} 

			});
				});

		$("#sr_save_ofp_comments").click(function(){			
					var id = $('#sr_id').text();
				
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/sr/" + id + "/add_comment/",
						data : {comment_data: $('#new_ofp_comment').val(), type:"1"},
						dataType: "json",
						success: function(json)
						{
					
							console.log("add ofp comment");
							
							$('#ofp_comments_list').html(json.comment_list);
							$('#new_ofp_comment').val('');
							$('#ofp_comments_block').hide();
							var count = $('#ofp_comment_count').text();
							var new_count = parseInt(count)+1;
							$('#ofp_comment_count').text(new_count);
						} 

			});
				});
				
				$("#save_remember_opf").click(function(){			
					var id = $('#sr_id').text();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/sr/" + id + "/save_remember/",
						data : {remember_text: $('#remember_text').val(), remember_date: $('#remember_date').val(),},
						dataType: "json",
						success: function(json)
						{
						if (json.blank_error){
							alert(json.blank_error)
						}		
						else {					
							console.log("add remember");
							$('.modal').modal('hide');
							$('#remember_text').val('');
							$('#remember_date').val('');
							alert("Напоминание создано");
						} 
						} 
			});
				});
				
		//изменить сделку для ОП
			$("body").on('click','.change_bg',function () {
			var id = $(this).parent().parent('tr').attr('id').replace('bg','');	
			$('#id_bg-pk').val(id);
			$.ajax({
					  type : "POST",
					  url: '/sr/search_bg/'+id+'/',
					  dataType: "json",
					  success: function(json){ 		
								  
						for (var j = 0; j < json.list.length; j++) {
							var fz = eval('json.'+json.list[j]);					
							$('#id_bg-'+json.list[j]+'').val(fz);
						}



			}
			});	
	});

			$("#id_user_group").change(function(){	
			
				search_users()
			});
				function search_users() {
					var id = $("#id_user_group").val();

					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/search_users/" + id + "/",
						dataType: "json",
						success: function(json)
						{
					
							console.log("success");
						
							$('select#id_user').html('')
							var options = '<option value="">---------</option>';
							$('select#id_user').append(options)
							var user = json
			
							$.each(user, function(key, value){
							$('select#id_user').append('<option value="' + key + '">' + value +'</option>');

							})
						} 

			});
				};
				
				$('#zayavka_pay_count_add').click(function(){			
					var id = $('#org_id').text();
					var count = $('#new_zayavka').val();  

					$.ajax
					({
						type : "POST",
						cache: false,
						data : {count:count,},
						url: "/organizations/" + id + "/add_zayavka_count/",
						dataType: "json",
						success: function(json)
						{
							console.log("count is changed")
							if (json.blank_error)
								
								{
									alert(json.blank_error)
								}
							else {
							$('#zayavka_pay_count').html(json.count)
							$('#zayavka_ostatok').html(json.ostatok)
							 $('#new_zayavka').val('');
							}
						} 

			});
				});
				//акт.номер и дата договора для допки в заявке
				$('#zayavka_actual_dog_save').click(function(){			
					var id = $('#org_id').text();
					var dog_number = $('#zayavka_actual_dog').val();  
					var dog_date = $('#zayavka_actual_dog_date').val(); 
					$.ajax
					({
						type : "POST",
						cache: false,
						data : {dog_number:dog_number,dog_date:dog_date},
						url: "/organizations/" + id + "/add_zayavka_actual_dog/",
						dataType: "json",
						success: function(json)
						{
							console.log("dog number is changed")
						
						} 

			});
				});

				
			//изменить заявку 
			$("body").on('click','.change_zayavka',function () {
			var id = $(this).parent().parent('tr').attr('id').replace('zayavka','');	
			$('#id_zayavka-pk').val(id);
			$.ajax({
					  type : "POST",
					  url: '/sr/search_zayavka/'+id+'/',
					  dataType: "json",
					  
					  success: function(json){ 	
				  
					for (var j = 0; j < json.list.length; j++) {
						var fz = eval('json.'+json.list[j]);						
						$('#id_zayavka-'+json.list[j]+'').val(fz);
				
				}
				if ($('#id_zayavka-type').val() == '1') {
					$('#id_zayavka-prifir').parent('p').css('display','none');
					$('#id_zayavka-summ').parent('p').css('display','none');
				}
				else {
					$('#id_zayavka-prifir').parent('p').css('display','block');
					$('#id_zayavka-summ').parent('p').css('display','block');
				}

			}
			});	
	});
	
			$("body").on('change','.zayavka_comment',function () {
			var id = $(this).attr('id').replace('zayavka_comment','');	
			$.ajax({
					  type : "POST",
					  url: '/organizations/zayavka/'+id+'/save_zayavka_comment/',
					  dataType: "json",
					  data : {comment:$(this).val()},
					  success: function(json){ 	
						console.log("success");


			}
			});				
			});
			
			$("body").on('change','#id_zayavka-work_is_finished',function () {
			var id = $(this).parent().parent('tr').attr('id').replace('zayavka','');	
			$.ajax({
					  type : "POST",
					  url: '/organizations/zayavka/'+id+'/finish_zayavka/',
					  dataType: "json",
					  data : {z_status:$(this).val()},
					  success: function(json){ 	
						console.log("success");
			}
			});				
			});
			
			
				$(".change_sr_vazhnost").change(function(){	
					var id = $(this).attr('id').replace('change_vazhnost','');
					var vazhnost = $(this).val();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/srs/" + id + "/change_vazhnost/"+vazhnost+"/",
						dataType: "json",
						success: function(json)
						{
					
							console.log("vazhnost is change");
							if (json.vazhnost == '3'){
								$('select#change_vazhnost'+id+'').removeClass().addClass('change_vazhnost bg-danger');
							}
							else if(json.vazhnost == '2'){
								$('select#change_vazhnost'+id+'').removeClass().addClass('change_vazhnost bg-warning');
							}
							else if(json.vazhnost == '1'){
								$('select#change_vazhnost'+id+'').removeClass().addClass('change_vazhnost bg-info');
							}	
							alert('Важность успешно изменена')
							
						} 

			});
				});			
			

				$(".change_sr_status").change(function(){	
					var id = $(this).attr('id').replace('change_sr_status','');
					var sr_status = $(this).val();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/srs/" + id + "/change_status/"+sr_status+"/",
						dataType: "json",
						success: function(json)
						{
					
							console.log("sr_status is change");
												
							
						} 

			});
				});		

				$(".change_sr_do_status").change(function(){	
					var id = $(this).attr('id').replace('change_sr_do_status','');
					var do_status = $(this).val();
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/srs/" + id + "/change_do_status/"+do_status+"/",
						dataType: "json",
						success: function(json)
						{
					
							console.log("do_status is change");
												
							
						} 

			});
				});	

				$("#save_bank").click(function(){			
					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/add_bank/",
						data : {new_bank: $('#bank_text').val()},
						dataType: "json",
						success: function(json)
						{
						if (json.blank_error){
							alert(json.blank_error)
						}		
						else {					
							console.log("bank is saved");
						

			

							$('#newBank').modal('hide');
							$('#bank_text').val('');
							

							if (json.bank_is_used){
								alert(json.bank_is_used);
							}		
							else {					
								alert("Банк успешно добавлен!");
								var filter = json.bank_dict
								$.each(filter, function(key, value){
									$('select#id_bg-bank_new').append('<option value="' + key + '">' + value +'</option>');
								})
							};
							var bank = json.bank;
							$("select#id_bg-bank_new option[value=" + bank + "]").attr('selected', 'true');
							$('.chosen-select').trigger("chosen:updated");	
							$('#banks').append("<p id='bank"+bank+"'>"+json.bank_name+" <a href='javascript:delete_bank("+bank+")' class='pull-right'><span class='glyphicon glyphicon-remove text-danger'></span></a></p>")
						}; 
						} 
			});
				});				
			$("body").on('change','#ruk_group_filter #id_group',function () {
			
			var id = $(this).val();
		
				search_ruk_group_users(id)
				
			});
				function search_ruk_group_users(id) {
				

					$.ajax
					({
						type : "POST",
						cache: false,
						url: "/search_ruk_group_users/" + id + "/",
						dataType: "json",
						success: function(json)
						{
					
							console.log("success");
						
							$(' select#id_user').html('')
							var options = '<option value="">---------</option>';
							$(' select#id_user').append(options)
							var user = json;
							
			
							$.each(user, function(key, value){
								
							$(' select#id_user').append('<option value="' + key + '">' + value +'</option>');

							})
							$('.chosen-select').trigger("chosen:updated");
						} 

			});
				};
				
				