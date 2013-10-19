using System;
using System.Web.Optimization;

namespace DEVDAYTalks.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);

            bundles.Add(new ScriptBundle("~/bundles/scripts")
                            .Include("~/Scripts/jquery-2.0.3.min.js")
                            .Include("~/Scripts/knockout-2.3.0.js")
                            .Include("~/Scripts/underscore.min.js")
                            .Include("~/Scripts/underscore-ko-1.2.2.min.js")
                            .Include("~/Scripts/bootstrap.min.js"));

            bundles.Add(new StyleBundle("~/Content/css")
                            .Include("~/Content/bootstrap/bootstrap.min.css")
                            .Include("~/Content/site.css"));
        }

        private static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
                throw new ArgumentNullException("ignoreList");
            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");
            ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }
    }
}