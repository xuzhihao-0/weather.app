//获取的所有的城市
let citys,weatherobj;

$.ajax({
	url:"https://www.toutiao.com/stream/widget/local_weather/city/",
	dataType:"jsonp",
	success:function(obj){
		citys=obj.data;
		for(let i in citys){
			let section = document.createElement('section');
			let citys_title = document.createElement('h1');
			citys_title.className = "citys_title";
			citys_title.innerHTML = i;
			section.appendChild(citys_title);
			for(let j in citys[i]){
				let citys_list = document.createElement('ul');
				citys_list.className = "citys_list";
				let li = document.createElement('li');
				li.innerHTML = j;
				citys_list.appendChild(li);
				section.appendChild(citys_list);
			}
			$(".citys_box").append(section);
		}
	}
})
$.getScript("https://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js",function(){
    getFullWeather(remote_ip_info.city);
});

function getFullWeather(nowcity){
	$(".now_city").html(nowcity);

	//获取当前城市的天气信息
	$.ajax({
	url:"https://www.toutiao.com/stream/widget/local_weather/data/?city="+nowcity,
	dataType:"jsonp",
	success:function(obj){
		weatherobj=obj.data;
		console.log(weatherobj)

		//当前的空气质量
		$(".now_air_quality").html(weatherobj.weather.quality_level);
		$(".now_temp").html(weatherobj.weather.current_temperature+"°");
		$(".now_wind_l").html(weatherobj.weather.wind_level+"级");
		$(".now_weather").html(weatherobj.weather.current_condition);
		$(".now_wind_d").html(weatherobj.weather.wind_direction);

		//近期两天天气情况
		//今天的温度
		$(".today_temp_max").html(weatherobj.weather.dat_high_temperature);
		$(".today_temp_min").html(weatherobj.weather.dat_low_temperature);
		$(".today_weather").html(weatherobj.weather.dat_condition);
		$(".today_img").attr('src',"img/"+weatherobj.weather.dat_weather_icon_id+".png");

		//明天的温度
		$(".tomorrow_temp_max").html(weatherobj.weather.tomorrow_high_temperature);
		$(".tomorrow_temp_min").html(weatherobj.weather.tomorrow_low_temperature);
		$(".tomorrow_weather").html(weatherobj.weather.tomorrow_condition);
		$(".tomorrow_img").attr('src',"img/"+weatherobj.weather.tomorrow_weather_icon_id+".png");

		//未来二十四小时之内

		let hours_array = weatherobj.weather.hourly_forecast;
		console.log(hours_array);
		for(let i = 0;i< hours_array.length;i++){
			//创建元素并添加到页面中
			let hours_list=document.createElement('li');
			let hours_time=document.createElement('span');
			hours_time.className='hours_time';

			let hours_img=document.createElement('img');
			hours_img.className='hours_img';

			let hours_temp=document.createElement('span');
			hours_temp.className='hours_temp';

			hours_list.appendChild(hours_time);
			hours_list.appendChild(hours_img);
			hours_list.appendChild(hours_temp);

			$('.hours_content').append(hours_list);

		//当下的时间
		hours_time.innerHTML = hours_array[i].hour+":00";
		hours_img.setAttribute('src',"img/"+hours_array[i].weather_icon_id+".png");
		hours_temp.innerHTML = hours_array[i].temperature+"°";
}
		//未来一周之内的天气情况
		let week_array = weatherobj.weather.forecast_list;
		console.log(week_array);
		for(let i = 0;i< week_array.length;i++){
			//创建元素并添加到页面中
			let week_list=document.createElement('li');
			let week_date=document.createElement('span');
			week_date.className='week_date';
			let week_weather = document.createElement('span');
			week_weather.className = 'week_weather';

			let week_img=document.createElement('img');
			week_img.className='week_img';
			let week_temp_max = document.createElement('span');
			week_temp_max.className = 'week_temp_max';
			let week_temp_min = document.createElement('span');
			week_temp_min.className = 'week_temp_min';

			let week_wind = document.createElement('span');
			week_wind.className = 'week_wind';
			let week_wind_intensity = document.createElement('span');
			week_wind_intensity.className = 'week_wind_intensity';

			week_list.appendChild(week_date);
			week_list.appendChild(week_weather);
			week_list.appendChild(week_img);
			week_list.appendChild(week_temp_max);
			week_list.appendChild(week_temp_min);
			week_list.appendChild(week_wind);
			week_list.appendChild(week_wind_intensity);


			$('.week_content').append(week_list);

		// 当下的时间
			week_date.innerHTML = week_array[i].date.substring(5,7)+"/"+week_array[i].date.substring(8);
			week_img.setAttribute('src',"img/"+week_array[i].weather_icon_id+".png");
			week_weather.innerHTML = week_array[i].condition;
			week_temp_max.innerHTML = week_array[i].high_temperature;
			week_temp_min.innerHTML = week_array[i].low_temperature;
			week_wind.innerHTML = week_array[i].wind_direction;
			week_wind_intensity.innerHTML = week_array[i].wind_level+"级";

		}

	}
})
}

//获取当前城市所有的信息
$(function(){
	$(".now_city").on("click",function(){
		$(".search").val("");
				$(".confirm").html('取消');
		$(".citys").css("display","block");
	})
	// $(".citys_list li").on("click",function(){
	// 	let son = this.innerHTML; 
	// 	getFullWeather(son);
	// 	$(".citys").css("display","none");
	// })
	// 事件委派
	$("body").delegate('.citys_list li', 'click', function() {
		let son = this.innerHTML; 
		getFullWeather(son);
		$(".citys").css("display","none");
	});
	$("body").delegate('.citys_title', 'click', function() {
		let son = this.innerHTML; 
		getFullWeather(son);
		$(".citys").css("display","none");
	});
	

	$(".search").on("focus",function(){
		$(".confirm").html('确认');
	})
	
	$(".confirm").on("click",function(){
			if(this.innerText == "取消"){
				$(".citys").css("display","none");				
			}else if(this.innerText == "确认"){
				let text = $(".search").val();
				console.log(text);
				for(let i in citys){
					if(text == i){
						getFullWeather(text);
						$(".citys").css("display","none");
						return;
					}else{
						for(let j in citys[i]){
							if(text == j){
								getFullWeather(text);
						$(".citys").css("display","none");
						return;								
							}
						}
					}
				} 
				alert("输入地区有误");
				$(".search").val("");
				$(".confirm").html('取消');
			}
		})		
	

})
// window.onload = function(){
// }



