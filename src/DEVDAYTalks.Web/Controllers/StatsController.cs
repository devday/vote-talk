using DEVDAYTalks.Web.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.UI;

namespace DEVDAYTalks.Web.Controllers
{
    public class StatsController : Controller
    {
        private readonly DEVDAY2013Entities _db = new DEVDAY2013Entities();

        [OutputCache(Duration = 15 * 60, Location = OutputCacheLocation.ServerAndClient)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetTalks()
        {
            var result = new Dictionary<string, double>();

            foreach (var talk in _db.Talks.Include("Votes").OrderBy(t => t.Title))
            {
                if (talk.Votes.Count == 0)
                {
                    result.Add(talk.Title, 0);
                    continue;
                }

                var avg = talk.Votes.Select(vote => vote.Score).Average();
                result.Add(talk.Title, avg);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
