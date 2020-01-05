/*
    Dobby Google API Wrapper

    This is a wrapper for Google API created and used in Dobby Co., Ltd.
    All the documents need to be published as web in public.

    Written by Juan Lee (juanlee@kaist.ac.kr)
    version: dobby.dev.0.1
*/

$("#btn-refresh").click(function(){
    localStorage.clear();
    location.reload();
});
  
  /**************************************************/
  // Sheet
  
async function readSheet(sheetId)
{
    let sheet = 1;
    sheets = {};
  
    try {
      // retrieve all sheets until not exist
      while (true) {
        const url = `https://spreadsheets.google.com/feeds/list/${sheetId}/${sheet}/public/values?alt=json`;
        const data = await $.getJSON(url, function(data){
          return data;
        });
  
        sheets[data.feed.title.$t] = data.feed.entry.map(function(entry){
          const colnames = Object.keys(entry)
            .filter(function(col){return col.startsWith("gsx")})
            .map(function(col){return col.slice(4)});
  
          let parsed = {};
          colnames.forEach(function(col){
            parsed[col] = entry["gsx$" + col].$t;
          });
          return parsed;
        });
  
        sheet += 1;
      }
    } 
    catch (error) {};
  
    return sheets;
};
  
  
  /**************************************************/
  // Time
  
function remainingTime() {
    let end = new Date();
    end.setHours(12,0,0,0);
    var now = new Date().getTime();
    var distance = end - now;

    if(distance<0){
        let end = new Date();
        end.setHours(36,0,0,0);
        var now = new Date().getTime();
        var distance = end - now;
    }
  
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
  
function remainingDate() {
    
    let tmp_info = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    let tmp_date = new Date(tmp_info);
    tmp_date.setDate(1);
    tmp_date.setMonth(tmp_date.getMonth() + 1);
    tmp_date.setDate(0);
  
    const last_date = tmp_date.getDate();
    const today_date = new Date(tmp_info).getDate();
    
    let end = new Date();
    end.setHours(12,0,0,0);
    var now = new Date().getTime();
    var distance = end - now;
    if(distance<0){
        return last_date - today_date -1;
    }
    else{  
        return last_date - today_date;
    }
};

function remainingDateDisplay(){
    let tmp_info = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    let tmp_date = new Date(tmp_info);
    tmp_date.setDate(1);
    tmp_date.setMonth(tmp_date.getMonth() + 1);
    tmp_date.setDate(0);
  
    const last_date = tmp_date.getDate();
    const today_date = new Date(tmp_info).getDate();
    return last_date - today_date;
}
  
function getDate(){
    let tmp_main = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Seoul"
    });
    let date_main = new Date(tmp_main).getDate();
    return date_main;
};
  
function todayPoint(initial, delta) {
    let date = getDate();
    return (initial + delta * (date - 1)).toLocaleString();
};
  
function tomorrowPoint(initial, delta){
    var date = getDate();
    var remaining = remainingDate();
  
    if (remaining === 0) {
      return initial.toLocaleString();
    }
    return (initial + delta * date).toLocaleString();
};
  
  /**************************************************/
// Updates
function numberWithCommas(x) {
    x = Math.round(x);
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
// updateTime
function updateTime(){
    // update time
    $("#elapsed-date").text(remainingDateDisplay());
    $("#elapsed-time").text(remainingTime());
  
    setTimeout(updateTime, 1000);
};
  
// load
function load(){
    // update main paint and paints
    readSheet("14RmJK2UOKFodgvEdEKwFCem8jshtdEuUskXQZdlsIsg").then(function(sheets){
  
        $("#paints").html("");
        $("#clicked-paints").html("");
    
        let main = sheets.Paints[0];
        let info = sheets.Info[0];
        
        todaySum =0;
        for(i=0;i<sheets.Paints.length;i++){
            todaySum+=parseInt(todayPoint(sheets.Paints[i]["초기값"],sheets.Paints[i]["변화값"]));
        }

        tomorrowSum = 0;
        for(i=0;i<sheets.Paints.length;i++){
            tomorrowSum+=parseInt(tomorrowPoint(sheets.Paints[i]["초기값"],sheets.Paints[i]["변화값"]));
        }

        $("#header2-1").css('background-image',`url(${main["그림url"]})`);

        $("#main-paint").html(`
        <div class="mbr-section-btn">
            <a class="btn display-4" href="#next" style="position: absolute; bottom: 35px; left: 5%; background-color: rgba(80, 80, 80, 0.5); color: white; font-family: COPRGTB;">
                <span class="mobi-mbri mobi-mbri-cash mbr-iconfont mbr-iconfont-btn"></span>
                ${info["오늘점수"]}
                <br>${numberWithCommas(todayPoint(
                    main["초기값"],
                    main["변화값"]
                  ))}<br>
            </a>
            <a class="btn display-4" href="#next" style="position: absolute; bottom: 35px; right: 5%; background-color: rgba(80, 80, 80, 0.5); color: white; font-family: COPRGTB;">
                <span class="mobi-mbri mobi-mbri-cash mbr-iconfont mbr-iconfont-btn"></span>
                ${info["내일점수"]}
                <br>${numberWithCommas(tomorrowPoint(
                    main["초기값"],
                    main["변화값"]
                  ))}<br>
            </a>
        </div>`);

        $("#total-point").html(`
            <section class="mbr-section content8 cid-rLzbqELo5S" id="content8-4">
                <div class="container">
                <div class="media-container-row title">
                    <div class="col-12 col-md-8">
                        <div class="mbr-section-btn align-center">
                            <a class="btn btn-black-outline display-4" href="#next" style="font-family: COPRGTB;">
                                <span class="mobi-mbri mobi-mbri-cash mbr-iconfont mbr-iconfont-btn"></span>
                                ${info["오늘점수총합"]}
                                <br>${todaySum.toLocaleString()}<br>
                            </a>
                            <a class="btn btn-black-outline display-4" href="#next" style="font-family: COPRGTB;">
                                <span class="mobi-mbri mobi-mbri-cash mbr-iconfont mbr-iconfont-btn"></span>
                                ${info["내일점수총합"]}
                                <br>${tomorrowSum.toLocaleString()}<br>
                            </a>
                        </div>
                    </div>
                </div>
                </div>
            </section>
        `);

        $("#description").html(`
            ${info["텍스트"]}
        `);

        $("#contact").html(`
            ${info["콘텍트"]}
        `);
  
        sheets.Paints.forEach(function(paint, index){
            if (index === 0) return;
    
            const title = paint["제목"];
            const url = paint["그림url"];
            const initial = paint["초기값"];
            const delta = paint["변화값"];
            var point = todayPoint(initial,delta);
            var tmrwpoint = tomorrowPoint(initial,delta);

        const paint_html =`<div class="mbr-gallery-item mbr-gallery-item--p1" data-video-url="false" data-tags="Awesome" id="card-${index}">
            <div href="#lb-gallery1-3" data-slide-to="${index-1}" data-toggle="modal">
                <img src="${url}" alt="" title="" style="height: 18rem;object-fit: cover;">
                <span class="icon-focus"></span>
                <span class="mbr-gallery-title mbr-fonts-style display-7" style="text-align: right; font-family: COPRGTB;">Tomorrow : ${numberWithCommas(tmrwpoint)}</span>
                <span class="mbr-gallery-title mbr-fonts-style display-7" style="font-family: COPRGTB;">Today : ${numberWithCommas(point)}</span>
            </div>
        </div>`;

        var clicked_paint_html;
        if (index == 1) {
            clicked_paint_html = `<div class="carousel-item active"><img src="${url}" alt="" title=""></div>`;
        } else {
            clicked_paint_html = `<div class="carousel-item"><img src="${url}" alt="" title=""></div>`;
        };
  
        $("#paints").append(paint_html);
        $("#clicked-paints").append(clicked_paint_html);

        });
    });
};
  
  /**************************************************/
  // Interactions
  
  // addInteraction
let addInteraction = function(index) {return function() {
    $(`#card-${index}`).toggleClass("col-md-6");
    $(`#card-${index}`).toggleClass("col-lg-3");
  
    $(`#card-${index}`).toggleClass("col-md-12");
    $(`#card-${index}`).toggleClass("col-lg-12");
    $(`#card-${index}`).scrollIntoView(true);
}};
  
function moveToCenter(index){
    $(`#card-${index}`).scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
    });
    $(`#paint-${index}`).scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center'
    });
}