using DEVDAYTalks.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.UI;

namespace DEVDAYTalks.Web.Controllers
{
    public class TalkController : Controller
    {
        private readonly DEVDAY2013Entities _db = new DEVDAY2013Entities();

        [OutputCache(Duration = 15 * 60, Location = OutputCacheLocation.ServerAndClient)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [OutputCache(Duration = 15 * 60, Location = OutputCacheLocation.ServerAndClient)]
        public JsonResult GetTalks()
        {
            var result =
                _db
                    .Talks
                    .OrderBy(t => t.StartingAt)
                    .AsEnumerable()
                    .Select(t => new
                                     {
                                         t.ID,
                                         t.Title,
                                         t.Speaker,
                                         t.Description,
                                         StartingAt = t.StartingAt.ToString(@"hh\:mm"),
                                         t.DurationInMin,
                                         t.Room
                                     });

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Vote(IEnumerable<UserVote> votes)
        {
            foreach (var vote in votes)
            {
                var talk = _db.Talks.Find(vote.ID);
                if (talk == null)
                    return Json(new { result = false });

                if (vote.Score < 0 || vote.Score > 5)
                    return Json(new { result = false });

                talk.Votes.Add(new Vote
                                   {
                                       CreatedOn = DateTime.Now,
                                       Score = vote.Score,
                                       TalkID = talk.ID
                                   });

                _db.SaveChanges();
            }

            return Json(new { result = true });
        }

        protected override void Dispose(bool disposing)
        {
            _db.Dispose();
            base.Dispose(disposing);
        }
    }
}