//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DEVDAYTalks.Web.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Talk
    {
        public Talk()
        {
            this.Votes = new HashSet<Vote>();
        }
    
        public int ID { get; set; }
        public string Title { get; set; }
        public string Speaker { get; set; }
        public string Description { get; set; }
        public System.TimeSpan StartingAt { get; set; }
        public int DurationInMin { get; set; }
        public string Room { get; set; }
    
        public virtual ICollection<Vote> Votes { get; set; }
    }
}
