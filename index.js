$.ajax({
  url: "https://andrhino.com/v1/api.php?key=a38088a3a9ba7c256f6580413927a274",
  method: "GET",
  dataType: "json",
})
  .done(function (data) {
    const transformedData = data.map((day) => ({
      date: day.date,
      schedule: Object.keys(day.schedule).map((sport) => ({
        sport: sport,
        streams: day.schedule[sport].map((event) => ({
          time: moment.unix(event.event_time).format(" MMM DD, HH:mm A"),
          league: event.leage,
          match: event.teams,
          channel_id: event.channel_id,
        })),
      })),
    }));

    transformedData[0].schedule.forEach((sport) => {
      $("#navbar-nav").append(`
            <a class="nav-link" href="#">${sport.sport.toUpperCase()}</a>
            `);

      const tableHtml = sport.streams
        .map((event, index) => {
          return `
            <tr>
              <th>${index + 1}</th>
              <td>${event.time}</td>
              <td>${event.match}</td>
              <td>


              <div class="btn-group w-100">
              <button class="btn btn-success watchBtn" data-link="https://cr7streams.movieon.online/live/channel.html?match_id=${
                event.channel_id
              }&title=${encodeURI(event.match)}" >Watch</button>


                <button class="btn btn-primary copyBtn" onclick="copyToClipBoard('${
                  event.channel_id
                }', '${encodeURI(event.match)}')">Copy</button>

                </div>

              </td>
            </tr>
          `;
        })
        .join("");

      $("#display").append(`
          <div class="col-12 mb-5">
            <div class="card bg-body-tertiary">
              <div class="card-header">${sport.sport.toUpperCase()} - ${
        transformedData[0].date
      }</div>
              <div class="card-body">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th style="width: 5%">#</th>
                      <th style="width: 20%">Time</th>
                      <th style="width: 55%">Event / Match</th>
                      <th style="width: 20%"></th>
                    </tr>
                  </thead>
                  <tbody class="align-middle">
                    ${tableHtml}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `);
    });

    $("#spinner-container").remove();
  })
  .fail(function () {
    window.location.reload();
  });

let index = 0

function copyToClipBoard(id, title) {

  index = index + 1

  const url = `https://cr7streams.movieon.online/live/channel.html?match_id=${id}&title=${title}&index=${index}`;

  window.navigator.clipboard.writeText(url);
}

$("body").on("click", ".copyBtn", function () {
  $(this).addClass("btn-danger");
});

$("body").on("click", ".watchBtn", function () {
  window.location.href = $(this).data("link");
});
