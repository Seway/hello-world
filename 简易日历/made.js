var month_long=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
var week_show=new Array("星期一","星期二","星期三","星期四","星期五","星期六","星期日");
//对应月份的天数
function judge_inmonth(year,month){
		var day;
		if(month==2){
			if(year%4==0) day=29;
			else day=28;
		}
		else day=month_long[month-1];
		return day;
}
//具体月份的第一天对应星期几
function judge_week(year,month){
	if(month==0) month=11;
	else month--;
	var myDate=new Date(year,month,1);
	return myDate.getDay();
}
//创建日期索引栏
function date_search(year_section,month_section){
	var today=new Date();
	var year_now=today.getFullYear(),month_now=today.getMonth()+1;

	for(var i=1900;i<=2050;i++){
		var year_temp=document.createElement('option');
		year_temp.innerHTML=i;
		year_temp.value=i;
		if(i==year_now) year_temp.selected="selected";
		year_section.appendChild(year_temp);
	}

	for(var i=1;i<=12;i++){
		var month_temp=document.createElement('option');
		month_temp.innerHTML=i;
		month_temp.value=i;
		if(i==month_now) month_temp.selected="selected";
		month_section.appendChild(month_temp);
	}
}
//创建日历的内容
function calendar(Year,Month,$days){
//	var $days=$('table div');
	var weekday=judge_week(Year,Month) ,j=1;
	if(weekday==0) weekday=6;
	else weekday--;
	
	var month_temp,year_temp;
	if(Month==1){
		month_temp=12,year_temp=Year-1;
	}
	else{
		month_temp=Month-1,year_temp=Year;
	}
	 
	var count=judge_inmonth(year_temp,month_temp);
	for(var i=weekday-1;i>=0;i--){
		$days.get(i).innerHTML=count--;
		$days.get(i).setAttribute("class","no_this_month");
		$days.get(i).setAttribute("name","last_month");

	}

	for(var i=weekday;j<=judge_inmonth(Year,Month);i++){
		$days.get(i).innerHTML=j++;
		$days.get(i).setAttribute("name","this_month");
	}

	for(j=1;i<42;i++){
		$days.get(i).innerHTML=j++;
		$days.get(i).setAttribute("class","no_this_month");
		$days.get(i).setAttribute("name","next_month");
	}
	var today=new Date(); 
	if(Year==today.getFullYear()&&Month==today.getMonth()+1){
		$days.get(today.getDate()+weekday-1).parentNode.parentNode.setAttribute("class","now_day");
	}
}

//根据索引栏改变日历内容
function calendar_change($year_selected,$month_selected,$blocks){
	$year_selected.change(function(e){
		$blocks.removeClass();
		$blocks.parents('.now_day').removeClass('now_day');
		var y=e.target.value;
		$blocks.empty();
		(y,$month_selected.val(),$blocks);
		calendar(y,$month_selected.val(),$blocks);

	});
	$month_selected.change(function(e){
		$blocks.removeClass();
		$blocks.parents('.now_day').removeClass('now_day');
		var m=e.target.value;
		$blocks.empty();
		calendar($year_selected.val(),m,$blocks);
	});
}
//时钟

function get_time(){
	var time=new Date();
	var h=time.getHours(),m=time.getMinutes(),s=time.getSeconds();
	if(h<10) h="0"+h;
	if(m<10) m="0"+m;
	if(s<10) s="0"+s;
	var temp=h+":"+m+":"+s;
	return temp;
}

//日历
function all_main(){
	//设置一个时钟
	var time=document.getElementById("time_clock");
	function clock(){
		time.innerHTML=get_time();
		return time.innerHTML;
	}
	setInterval(clock,100);
//创建日历
	var today=new Date();
	var year_now=today.getFullYear(),month_now=today.getMonth()+1;

	var $days=$('table div a');
	calendar(year_now,month_now,$days);

	var $year_selected=$('#year_select'),$month_selected=$('#month_select');
	$days.on("click",function(e){
		var year_now=$year_selected.val(),month_now=$month_selected.val();
		//跳转到上个月
		if(this.getAttribute("name")=="last_month"){
			if(month_now==1){
				month_now=12;
				year_now--;
			}
			else{
				month_now--;
			}
			if(year_now==$year_selected.val()&&month_now!=$month_selected.val()){
				$month_selected.val(month_now);
			}
			else if(year_now!=$year_selected.val()&&month_now!=$month_selected.val()){
				$year_selected.val(year_now);
				$month_selected.val(month_now);

			}
			$month_selected.change();					
		}
		//跳转到下个月
		else if(this.getAttribute("name")=="next_month"){
			if(month_now==12){
				month_now=1;
				year_now++;
			}
			else{
				month_now++;
			}
			if(year_now==$year_selected.val()&&month_now!=$month_selected.val()){
				$month_selected.val(month_now);
			}
			else if(year_now!=$year_selected.val()&&month_now!=$month_selected.val()){
				$year_selected.val(year_now);
				$month_selected.val(month_now);
			}
			$month_selected.change();
		}
		//选中当月的某天 查看详细信息
		else if(this.getAttribute("name")=="this_month"){
			var storage=window.localStorage;
			var aim_to_show_list=document.getElementById("show_list");
		//清空show_list的内容
			var lis=aim_to_show_list.childNodes;
			var cnt=lis.length;
			for(var i=0;i<cnt;i++){
				aim_to_show_list.removeChild(lis[0]);
			}
		//更新备忘录的时间显示
		var aim_to_show_on_target_time=document.getElementById("on_target_time");
		var i;
		for(i=0;i<42;i++){
			if(this==$days.get(i)) break;
		}
		aim_to_show_on_target_time.innerText=year_now+"-"+month_now+"-"+this.innerText+" "+week_show[i%7];
		//查询选中的日期是否存在备忘
			var mark=year_now+"-"+month_now+"-"+this.innerHTML;
			var count=1;
			while(1){
				var temp=storage.getItem(mark+"-"+count);
				if(temp==undefined) break;
				var newnode=document.createElement("li");
				newnode.innerText=temp;

				var newbox=document.createElement("div");
				

				
		//添加删除按钮
					var finish=document.createElement("input");
					finish.type="button";
					finish.value="X";
					newbox.appendChild(newnode);
					newbox.appendChild(finish);
					finish.onclick=function(){
					//在显示中删除
						var t=document.getElementById("show_list");
						
						var lis1=document.querySelectorAll("#show_list li");
						
						var lis2=document.querySelectorAll("#show_list input");
						var i;
						for(i=0;i<lis2.length;i++){
							if(lis2[i]==this){
									t.removeChild(t.childNodes[i]);
									break;
								}
						}
						i++;
					//在存储中删除
						var $year_selected=$('#year_select'),$month_selected=$('#month_select');
						var year_now=$year_selected.val(),month_now=$month_selected.val();
						var cnt=lis2.length;
						var storage=window.localStorage;
						var to=document.getElementById("on_target_time");
						var turn=to.innerText.split("-")[2].split(" ",1);
						var last=year_now+"-"+month_now+"-"+turn+"-"+cnt;
						var first=year_now+"-"+month_now+"-"+turn+"-"+i;
						if(cnt==1) storage.removeItem(last);
						else{
							storage.setItem(first,storage.getItem(last));
							storage.removeItem(last);
						}
						$(".on_target a").click();
					}
			//修改备忘录内容
				newnode.onclick=function(){
					var lis=document.querySelectorAll("#show_list li");
					for(var i=1;i<=lis.length;i++){
							if(lis[i-1]==this){
								var edit=prompt("请修改:",lis[i-1].innerHTML);
								if(edit!=null){
									if(edit == '' || edit == undefined) alert("内容不能为空");
									else {
										var storage=window.localStorage;
										storage.setItem(mark+"-"+i,edit);
										lis[i-1].innerHTML=edit;
									}
								}
							}
					}
				}
				aim_to_show_list.appendChild(newbox);
				count++;
			}
			var temp=document.getElementById("back_item");
			if(count==1){
				temp.innerText="无事件";
			}
			else{
				temp.innerText="";
			}
		//标记该元素为被选中
			for(var i=0;i<42;i++){
				$days.parents().removeClass("on_target");
				this.parentNode.parentNode.classList.add("on_target");
			}
			
		}
	});
//绑定索引栏事件
	calendar_change($year_selected,$month_selected,$days);
//绑定左右图标事件
	var button_go_left=document.getElementById("page_go_left");
	var button_go_right=document.getElementById("page_go_right");
	button_go_left.onclick=function(){
		var year_now=$year_selected.val(),month_now=$month_selected.val();
			if(month_now==1){
				month_now=12;
				year_now--;
			}
			else{
				month_now--;
			}
			if(year_now==$year_selected.val()&&month_now!=$month_selected.val()){
				$month_selected.val(month_now);
			}
			else if(year_now!=$year_selected.val()&&month_now!=$month_selected.val()){
				$year_selected.val(year_now);
				$month_selected.val(month_now);

			}
			$month_selected.change();
	}
	button_go_right.onclick=function(){
		var year_now=$year_selected.val(),month_now=$month_selected.val();
		if(month_now==12){
				month_now=1;
				year_now++;
			}
			else{
				month_now++;
			}
			if(year_now==$year_selected.val()&&month_now!=$month_selected.val()){
				$month_selected.val(month_now);
			}
			else if(year_now!=$year_selected.val()&&month_now!=$month_selected.val()){
				$year_selected.val(year_now);
				$month_selected.val(month_now);
			}
			$month_selected.change();
	}
//绑定备忘录图标事件
	var button_add=document.getElementById("button_add");
	button_add.onclick=function(){
		var aim_to_show_list=document.getElementById("show_list");
		var temp=document.createElement("input");
		temp.setAttribute("type","text");
		temp.onblur=function(){
			var $today=$('.on_target');
			var year_now=$year_selected.val(),month_now=$month_selected.val();
			var newbox=document.createElement("div");
			var tenp=document.createElement("li");
			tenp.innerText=this.value;

//添加删除按钮
			var finish=document.createElement("input");
			finish.type="button";
			finish.value="X";
			finish.onclick=function(){
				var t=document.getElementById("show_list");
				
				var lis1=document.querySelectorAll("#show_list li");
				
				var lis2=document.querySelectorAll("#show_list input");
				
				for(var i=0;i<lis2.length;i++){
					if(lis2[i]==this){
							t.removeChild(t.childNodes[i]);
						}
				}
								//在存储中删除
								var $year_selected=$('#year_select'),$month_selected=$('#month_select');
								var year_now=$year_selected.val(),month_now=$month_selected.val();
								var cnt=lis2.length;
								var storage=window.localStorage;
								var to=document.getElementById("on_target_time");
								var turn=to.innerText.split("-")[2].split(" ",1);
								var last=year_now+"-"+month_now+"-"+turn+"-"+cnt;
								var first=year_now+"-"+month_now+"-"+turn+"-"+i;
								if(cnt==1) storage.removeItem(last);
								else{
									storage.setItem(first,storage.getItem(last));
									storage.removeItem(last);
								}
						//刷新备忘录
					$(".on_target a").click();
				}

			aim_to_show_list.removeChild(this);
			newbox.appendChild(tenp);
			newbox.appendChild(finish);
			
			aim_to_show_list.appendChild(newbox);
			tenp.onclick=function(){
				var lis=document.querySelectorAll("#show_list li");
				for(var i=1;i<=lis.length;i++){
						if(lis[i-1]==this){
							var edit=prompt("请修改:",lis[i-1].innerHTML);
							if(edit!=null){
								if(edit == '' || edit == undefined) alert("内容不能为空");
								else {
									var storage=window.localStorage;
									var $year_selected=$('#year_select'),$month_selected=$('#month_select');
									var year_now=$year_selected.val(),month_now=$month_selected.val();
									var to=document.getElementById("on_target_time");
									var turn=to.innerText.split("-")[2].split(" ",1);
									var marks=year_now+"-"+month_now+"-"+turn;
									
									storage.setItem(marks+"-"+i,edit);
									lis[i-1].innerHTML=edit;
								}
							}
						}
				}
			}

			

			var mark=year_now+"-"+month_now+"-"+$today.children().children().text()+"-"+aim_to_show_list.children.length;
			var storage=window.localStorage;
			storage.setItem(mark,tenp.innerText);
		}
		aim_to_show_list.appendChild(temp);
		//修改备忘录内容
		var tenp=document.getElementById("back_item");
		tenp.innerText="";
	}
	//初次创建日历
	var chose=judge_week(year_now,month_now);
	if(chose==0) chose=6;
	else chose--;
	$days.get(chose+today.getDate()-1).parentNode.parentNode.classList.add("on_target");
	$days.get(chose+today.getDate()-1).click();
	
}
//修改备忘录内容
function content_change(){
	var aim_to_show_list=document.getElementById("show_list");
	var sons=aim_to_show_list.childNodes;
	var count=sons.length;
}
//返回今日
function go_today(){
	var today=new Date();
	var year_now=today.getFullYear(),month_now=today.getMonth()+1;
	var $year_selected=$('#year_select'),$month_selected=$('#month_select');
	
	$year_selected.val(year_now),$month_selected.val(month_now);
	$month_selected.change();
}
