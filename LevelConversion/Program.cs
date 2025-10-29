using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LevelConversion
{
    internal class Program
    {
        static int[] count = new int[1000];
        static int maxcount = 0;
        static void Main(string[] args)
        {

            fct1();
            //fct2();

        }


        static void dealLine(string line)
        {
            string a=line.Replace("PART", "").Replace(".png", "");
            string[] alist = a.Split('-');
            int part = int.Parse(alist[0]);
            int subpart = int.Parse(alist[1]);
            if (subpart > count[part])
                count[part] = subpart;
            if(part>maxcount )
                maxcount = part;

        }
        static void fct2()
        {
            Console.WriteLine("Will read list.txt");
            Console.WriteLine("Will convert them to  level_*.json in ./OUTP folder");
            //Console.ReadLine();
            string[] lines = File.ReadAllLines("list.txt");
            for(int i = 0;i< lines.Length;i++)
            {
                string [] ListLine = lines[i].Split(' ');
                dealLine(ListLine[ListLine.Length - 1]);
            }
            string str = "";
            for (int j = 0; j < maxcount; j++)
            {
                str += "\"" + j + "\":{\"count\":"+(count[j]+1)+"},\n";
            }

        }

        static void fct1()
        {
            Console.WriteLine("Will read all files *.csv from ./IN folder");
            Console.WriteLine("Will convert them to  level_*.json in ./OUT folder");
            //Console.ReadLine();
            DirectoryInfo d = new DirectoryInfo(@".\In");
            FileInfo[] Files = d.GetFiles("*.csv");
            //manageFile(Files[0]);

            foreach (FileInfo file in Files)
            {
                manageFile(file);
            }

        }

        static void manageFile(FileInfo f)
        {
            string[] lines = File.ReadAllLines(f.FullName);
            string json = "{\n";
            
            //line 1
            List <string>L1 =lines[1].Split(',').ToList();
            json+="\""+L1[0]+"\": {";
            string L1Clean=L1[1].Replace(":", "");
            List<string> L1CleanList = L1Clean.Split(' ').ToList();
            json += "\"" + L1CleanList[0] + "\": \""+ L1CleanList[1]+"\",";
            json += "\"" + L1CleanList[2] + "\": " + L1CleanList[3] + ",";
            json += "\"" + L1CleanList[4] + "\": \"";
            for (int i = 5; i < L1CleanList.Count; i++)
                json += L1CleanList[i] + " ";
            json +=  "\"";
            json +="},\n";

            //line 2
            json+="\"Puzzle\": {";
            string L2Clean = lines[2].Replace(":", "");
            List<string> L2CleanList = L2Clean.Split(' ').ToList();
            json += "\"Layers\": \"" + L2CleanList[2] + "\",";
            json += "\"" + L2CleanList[3] + "\": " + L2CleanList[4] + ",";
            json += "\"" + L2CleanList[5] + "\": " + L2CleanList[6] + ",";
            json += "\"" + L2CleanList[7] + "\": " + L2CleanList[8] + ",";
            json += "\"" + L2CleanList[9] + "\": " + L2CleanList[10].Replace("\"","") ;
            json +="},\n";

            //line 3
            json += "\"Puzzle_info\": {";
            string L3Clean = lines[3].Replace(":", "").Replace(",", " ");
            List<string> L3CleanList = L3Clean.Split(' ').ToList();
            for(int j=1;j<11;j++)
                json += "\"" + L3CleanList[j*2] + "\": " + L3CleanList[j * 2+1] + ",";
            json = json.Remove(json.Length - 1);//remove last ,
            json += "},\n";

            //line 4
            json += "\"Title\": {\n\"EN\":\"";
            json += lines[4].Substring(6).Replace("\"","'");
            json += "\"\n},\n";

            //line 5
            json += "\"Goal\":  {\n\"EN\":\"";
            json += lines[5].Substring(5);
            json += "\"\n},\n";
            json += "\"Parts\":[\n";
            
            for (int i = 6; i < lines.Length; i++)
            {
                json=ManageParts(json, lines[i]);
            }
            json = json.Remove(json.Length - 1);//remove last ,
            json = json.Remove(json.Length - 1);//remove last ,
            json += "\n]";
            //end
            json += "\n}";
            string path = @".\Out\level_" + f.Name.Replace(".csv", ".json");
            File.WriteAllText(path, json);
        }

        private static string ManageParts(string json, string line)
        {
            List<string> split1List = line.Split('\"').ToList();
            List<string> split2List = split1List[1].Split(',').ToList();
            string no=split2List[0].Substring(5);
            string name = split2List[1].TrimStart();
            string rest = split1List[2].Substring(1);
            string rest_clean2 = rest.Replace(" (", "(");
            List<string> splitRestList = rest_clean2.Split(' ').ToList();
            json += "{\"no\": "+ no+ ",\"name\": \""+name+"\",";
            int j = 0;
            while(j< splitRestList.Count-1)
            //for (int j = 0; j < splitRestList.Count / 2; j++)
            {
                string a = splitRestList[j + 1];
                string c = splitRestList[j].Replace(":", "");
                if ( j + 2< splitRestList.Count)
                {
                    if (!splitRestList[j + 2].Contains(":"))
                    {
                        a = a + " " + splitRestList[j + 2];
                        j= j + 1;
                    }
                }
                string b = a.Replace("(", " (");
                bool ret = int.TryParse(b, out int n);
                

                if (ret==false)//string
                    json += "\"" + c + "\": \"" + b + "\",";
                else
                    json += "\"" + c + "\": " + b + ",";
                j = j + 2;
            }
            json = json.Remove(json.Length - 1);//remove last ,
            json += "},\n";
            return json;
        }
    }
}
